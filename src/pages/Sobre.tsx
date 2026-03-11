import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import { motion } from "framer-motion";
import { Eye, Target, Heart } from "lucide-react";

const values = [
  {
    icon: Eye,
    title: "Visão",
    desc: "Ser referência em automação residencial no Brasil, tornando a tecnologia invisível e acessível para residências de alto padrão.",
  },
  {
    icon: Target,
    title: "Missão",
    desc: "Transformar residências em experiências inteligentes, entregando soluções tecnológicas que elevam o conforto, a segurança e a estética.",
  },
  {
    icon: Heart,
    title: "Valores",
    desc: "Excelência, inovação contínua, respeito à arquitetura, compromisso com o cliente e tecnologia como ferramenta de bem-estar.",
  },
];

const Sobre = () => {
  return (
    <main className="pt-20">
      <AnimatedSection className="py-20 md:py-28">
        <div className="container">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-primary mb-4">Sobre Nós</p>
          <h1 className="font-display text-4xl md:text-6xl font-light text-foreground max-w-3xl leading-tight">
            A arte de tornar a tecnologia{" "}
            <span className="font-semibold">invisível</span>
          </h1>
        </div>
      </AnimatedSection>

      {/* Story */}
      <AnimatedSection className="pb-24 md:pb-32">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-medium text-foreground mb-8">Nossa História</h2>
              <div className="space-y-6 font-body text-muted-foreground leading-relaxed">
                <p>
                  A Home3 Tecnologia nasceu da convicção de que a tecnologia residencial deve servir ao estilo de vida, 
                  não competir com ele. Fundada por profissionais apaixonados por arquitetura e engenharia, 
                  nossa empresa se dedica a criar experiências residenciais onde a tecnologia é sentida, não vista.
                </p>
                <p>
                  Ao longo de mais de uma década, desenvolvemos uma metodologia única que começa pela escuta atenta 
                  do cliente e do arquiteto, passa pelo projeto detalhado de infraestrutura e culmina na entrega 
                  de uma casa que responde intuitivamente às necessidades de quem a habita.
                </p>
                <p>
                  Trabalhamos em parceria com os melhores escritórios de arquitetura e design de interiores do país, 
                  garantindo que cada solução tecnológica se integre perfeitamente ao projeto estético da residência.
                </p>
              </div>
            </div>

            <div className="bg-foreground rounded-lg p-10 md:p-14">
              <p className="font-display text-xs uppercase tracking-[0.3em] text-primary mb-8">Expertise</p>
              <div className="space-y-8">
                {[
                  { label: "Automação Residencial", years: "10+ anos" },
                  { label: "Projetos de Iluminação", years: "200+ projetos" },
                  { label: "Áudio & Home Theater", years: "Certificação THX" },
                  { label: "Infraestrutura de Rede", years: "Parceiro Ubiquiti" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex items-center justify-between border-b border-card/10 pb-4"
                  >
                    <span className="font-body text-sm text-card/80">{item.label}</span>
                    <span className="font-display text-sm text-primary">{item.years}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Mission / Vision / Values */}
      <AnimatedSection className="py-24 bg-muted">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="text-center"
              >
                <item.icon size={32} className="text-primary mx-auto mb-6" strokeWidth={1.5} />
                <h3 className="font-display text-xl font-medium text-foreground mb-4">{item.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection className="py-24 md:py-32">
        <div className="container text-center">
          <h2 className="font-display text-3xl md:text-4xl font-light text-foreground mb-6">
            Vamos construir algo <span className="font-semibold">extraordinário</span>
          </h2>
          <Link to="/contato">
            <Button variant="brass" size="xl">Entre em Contato</Button>
          </Link>
        </div>
      </AnimatedSection>
    </main>
  );
};

export default Sobre;
