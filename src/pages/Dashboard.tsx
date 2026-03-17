import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  Folder,
  Download,
  ExternalLink,
  ChevronRight,
  Home,
  LogOut,
  RefreshCw,
  FileImage,
  FileVideo,
  FileSpreadsheet,
  File,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { filesApi, DriveFile, DriveFolder } from "@/lib/api";

// Helper para formatar tamanho de arquivo
function formatFileSize(bytes?: string): string {
  if (!bytes) return "";
  const size = parseInt(bytes, 10);
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

// Helper para formatar data
function formatDate(dateString?: string): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Ícone baseado no tipo de arquivo
function getFileIcon(mimeType: string) {
  if (mimeType.includes("folder")) return Folder;
  if (mimeType.includes("image")) return FileImage;
  if (mimeType.includes("video")) return FileVideo;
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return FileSpreadsheet;
  if (mimeType.includes("pdf") || mimeType.includes("document") || mimeType.includes("text"))
    return FileText;
  return File;
}

const Dashboard = () => {
  const { user, client, logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [files, setFiles] = useState<DriveFile[]>([]);
  const [subfolders, setSubfolders] = useState<DriveFolder[]>([]);
  const [currentFolder, setCurrentFolder] = useState<DriveFolder | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<DriveFolder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirecionar se não autenticado ou se for admin
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
    if (user?.role === "ADMIN") {
      navigate("/admin");
    }
  }, [user, authLoading, navigate]);

  // Carregar arquivos
  const loadFiles = async (folderId?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = folderId
        ? await filesApi.listFolder(folderId)
        : await filesApi.list();

      setFiles(data.files);
      setSubfolders(data.subfolders);
      
      if (!folderId) {
        // Pasta raiz
        setCurrentFolder(data.folder);
        setBreadcrumbs([]);
      } else {
        setCurrentFolder(data.folder);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao carregar arquivos";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar arquivos iniciais
  useEffect(() => {
    if (user && user.role === "CLIENT") {
      loadFiles();
    }
  }, [user]);

  // Navegar para subpasta
  const navigateToFolder = (folder: DriveFolder) => {
    setBreadcrumbs((prev) => [...prev, currentFolder!]);
    loadFiles(folder.id);
  };

  // Voltar para pasta anterior
  const navigateBack = (index?: number) => {
    if (index === undefined) {
      // Voltar para raiz
      setBreadcrumbs([]);
      loadFiles();
    } else {
      // Voltar para pasta específica do breadcrumb
      const targetFolder = breadcrumbs[index];
      setBreadcrumbs((prev) => prev.slice(0, index));
      if (index === 0) {
        loadFiles();
      } else {
        loadFiles(targetFolder.id);
      }
    }
  };

  // Abrir arquivo
  const openFile = (file: DriveFile) => {
    if (file.webViewLink) {
      window.open(file.webViewLink, "_blank");
    }
  };

  // Download de arquivo
  const downloadFile = async (file: DriveFile) => {
    const token = localStorage.getItem("auth_token");
    const url = filesApi.getDownloadUrl(file.id);

    // Fazer download via fetch para incluir token
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Erro ao baixar arquivo");

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Erro ao baixar:", err);
    }
  };

  // Handler de logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (authLoading) {
    return (
      <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header do Dashboard */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                Olá, {user?.name?.split(" ")[0]}!
              </h1>
              <p className="text-muted-foreground mt-1">
                {client?.companyName || "Bem-vindo ao seu portal de arquivos"}
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut size={16} />
              Sair
            </Button>
          </div>

          {/* Card principal */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="border-b border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Seus Arquivos</CardTitle>
                  <CardDescription>
                    {client?.googleDriveFolderName || "Pasta do projeto"}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => loadFiles(currentFolder?.id)}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                </Button>
              </div>

              {/* Breadcrumbs */}
              {breadcrumbs.length > 0 && (
                <div className="flex items-center gap-1 mt-4 text-sm">
                  <button
                    onClick={() => navigateBack()}
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <Home size={14} />
                    Início
                  </button>
                  {breadcrumbs.map((folder, index) => (
                    <span key={folder.id} className="flex items-center gap-1">
                      <ChevronRight size={14} className="text-muted-foreground" />
                      <button
                        onClick={() => navigateBack(index + 1)}
                        className="text-primary hover:underline"
                      >
                        {folder.name}
                      </button>
                    </span>
                  ))}
                  <ChevronRight size={14} className="text-muted-foreground" />
                  <span className="text-foreground font-medium">{currentFolder?.name}</span>
                </div>
              )}
            </CardHeader>

            <CardContent className="p-6">
              {/* Estado de erro */}
              {error && (
                <div className="text-center py-8">
                  <p className="text-destructive mb-4">{error}</p>
                  <Button variant="outline" onClick={() => loadFiles()}>
                    Tentar novamente
                  </Button>
                </div>
              )}

              {/* Estado de loading */}
              {isLoading && !error && (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}

              {/* Lista de arquivos */}
              {!isLoading && !error && (
                <div className="space-y-2">
                  {/* Subpastas */}
                  {subfolders.map((folder) => (
                    <motion.div
                      key={folder.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer group"
                      onClick={() => navigateToFolder(folder)}
                    >
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Folder className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{folder.name}</p>
                        <p className="text-sm text-muted-foreground">Pasta</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </motion.div>
                  ))}

                  {/* Arquivos */}
                  {files.map((file) => {
                    const FileIcon = getFileIcon(file.mimeType);
                    const isGoogleDoc = file.mimeType.includes("google-apps");

                    return (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-muted">
                          <FileIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{file.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {file.size && <span>{formatFileSize(file.size)}</span>}
                            {file.modifiedTime && (
                              <>
                                {file.size && <span>•</span>}
                                <span>{formatDate(file.modifiedTime)}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {file.webViewLink && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openFile(file)}
                              title="Abrir"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                          {!isGoogleDoc && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => downloadFile(file)}
                              title="Baixar"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Vazio */}
                  {files.length === 0 && subfolders.length === 0 && (
                    <div className="text-center py-12">
                      <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Esta pasta está vazia</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
};

export default Dashboard;
