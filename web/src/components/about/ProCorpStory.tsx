'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

/**
 * PRO CORP Story — "The Business Before the Technology".
 * Icono flotante a la izquierda en About Us; al hacer click abre el
 * documento completo como lector superpuesto. Trilingüe ES/EN/PT.
 * Fuente: 2026-08-12 PRO CORP Story.docx
 */

type Lang = 'en' | 'es' | 'pt';

interface Story {
  label: string;
  title: string;
  subtitle: string;
  sections: { h?: string; ps: string[] }[];
  closing: string;
}

const STORY: Record<Lang, Story> = {
  en: {
    label: 'Manifest',
    title: 'The Business Before the Technology',
    subtitle: 'A concise commitment to Business Engineering',
    sections: [
      {
        ps: [
          'Most companies do not suffer from a lack of information, ideas or technology. They suffer because those elements are fragmented. Strategy is separated from operations. Legal analysis arrives apart from commercial ambition. Technology teams receive requirements after the important decisions have already been made. Reports explain what happened, but often after management’s opportunity to change the outcome has passed.',
          'PRO CORP begins with a different idea: a business is a living system. Customers, people, capital, processes, rules, information and technology constantly affect one another. To change the business, management must first understand how that system truly works.',
          'That is why PRO CORP is not about a product, a predetermined solution or an AI tool looking for a use. It begins with the business — and with the consequential decision management needs to make.',
        ],
      },
      {
        h: 'Making the business visible',
        ps: [
          'The first task is to see the business as it operates, not merely as it appears in organizational charts or historical reports. That means connecting information, exposing relationships and identifying the forces that create value or prevent it: demand, price, capacity, capital, people, processes, risk, regulation, technology and time.',
          'Timing matters. Accurate information can still be useless if it arrives after the opportunity to act. PRO CORP therefore focuses on decision-time visibility: delivering the right information at the speed required by the decision. Not every signal must be instantaneous. Every important signal must arrive while management can still influence the result.',
          'Earlier visibility creates room to decide. But seeing what is happening is only the beginning.',
        ],
      },
      {
        h: 'Making the future testable',
        ps: [
          'Once the business is visible, PRO CORP models how its essential parts connect. A model forces clarity. It reveals assumptions, dependencies and constraints that are otherwise easy to overlook.',
          'Simulation makes that understanding useful. Management can change an assumption, explore an alternative and observe how the system may respond. Instead of pretending to predict one inevitable future, PRO CORP helps leaders compare plausible futures and test consequential choices before committing capital, people or time.',
          'Real-time visibility reveals what is changing. Simulation helps management understand what those changes could mean. Together, they extend the distance between recognizing a possibility and being forced to live with its consequences.',
        ],
      },
      {
        h: 'Engineering one answer that can work',
        ps: [
          'Understanding the business and exploring alternatives are not enough. The selected path must survive the real world.',
          'PRO CORP calls this Business Engineering: the discipline of making a business understandable, its alternatives testable and its chosen future executable. It brings strategy, operating design, commercial thinking, legal and institutional constraints, data, technology and implementation into the same decision.',
          'Every proposed transformation must pass three tests. It must be valuable, creating meaningful commercial, financial or strategic value. It must be permissible, capable of operating within the relevant legal, regulatory and institutional environment, with qualified counsel involved where professional legal judgment is required. And it must be executable, supported by the people, processes, technology and capital needed to make it real.',
          'The client does not need disconnected recommendations. The client needs one accountable path that works.',
        ],
      },
      {
        h: 'Borderless by design',
        ps: [
          'Business Engineering is not a sector-specific service. It is the philosophy PRO CORP applies to every business opportunity, in any vertical market and any geography. The subject changes; the discipline does not. Every opportunity is still a system to be understood, a set of possibilities to be tested and a path to be engineered.',
          'That opportunity might be a real estate development project in Colombia, where land, market demand, capital, permitting and execution must become one viable plan. It might be an immersive educational-entertainment event in Spain, where the experience, audience, economics, operations and technology must reinforce one another. It might be a citizenship and legal-services solution for clients in Europe, designed around a clear client journey while qualified legal professionals address the relevant legal requirements.',
          'The same philosophy can be applied to the monetization and lawful resolution of a distressed asset under foreclosure; a financial simulator using Monte Carlo analysis in Portugal; or a secure private portal that captures and manages information from different systems for a company in jeopardy. These opportunities belong to different industries and countries, yet each requires the same fundamental work: see the whole system, understand its constraints, test the alternatives, design an integrated solution and execute it in the real world.',
          'PRO CORP is a boutique. Its strength is not a narrow inventory tied to one market. Its inventory of processes, patterns and solutions is borderless — across geography and industry — and is recombined around the specific reality of each client.',
        ],
      },
      {
        h: 'Co-engineered with the client',
        ps: [
          'That breadth does not mean arriving with a universal answer. PRO CORP never begins a project without the client’s direct involvement. The client holds the operating knowledge, context, judgment and institutional reality that no outside team can manufacture.',
          'Business Engineering is therefore done hand in hand with management and the people closest to the work. Together, PRO CORP and the client define the consequential decision, examine the system, challenge assumptions, test alternatives and build the path forward. Client participation is not ceremonial consultation; it is part of the engineering method.',
          'Without involvement, there is no ownership. Without ownership, there is no commitment. Without commitment, even an intelligent design becomes only half a solution.',
        ],
      },
      {
        h: 'From decision to reality',
        ps: [
          'PRO CORP begins with one consequential decision. It sees the business as it is, models the system, simulates alternatives, helps management decide, engineers the commercial and operational path, executes the change and learns from reality.',
          'Technology serves this process. It connects capabilities, integrates fragmented information, automates work when automation creates value and supports new operating models. It is the instrument, not the destination.',
          'AI is an accelerator. It can recognize patterns, understand information, generate alternatives, assist decisions, automate work and coordinate action. But AI does not make a weak operating model strong. Applied to the wrong process, it accelerates the wrong process. PRO CORP applies AI only where it improves the quality, speed or reach of a governed business decision.',
          'Execution is what makes the difference. Understanding without action changes nothing. Simulation without decisions changes nothing. Strategy without implementation changes nothing. Technology without adoption changes nothing.',
          'So PRO CORP prototypes, integrates, implements, measures and adapts. When reality reveals something the model did not, the learning becomes part of the next decision.',
        ],
      },
      {
        h: 'Our Promise',
        ps: [
          'PRO CORP exists to help management see earlier, test before committing and execute what works. Its purpose is not to impose technology on a company. It is to help the company understand what it could become — and then engineer a credible path from decision to reality.',
          'Better businesses are not created by insight alone. They become possible when insight, choice and execution operate as one system.',
        ],
      },
    ],
    closing: 'We engineer businesses.',
  },
  es: {
    label: 'Manifiesto',
    title: 'El Negocio Antes que la Tecnología',
    subtitle: 'Un compromiso conciso con la Ingeniería de Negocios',
    sections: [
      {
        ps: [
          'La mayoría de las empresas no sufren por falta de información, ideas o tecnología. Sufren porque esos elementos están fragmentados. La estrategia está separada de las operaciones. El análisis legal llega aparte de la ambición comercial. Los equipos de tecnología reciben requerimientos después de que las decisiones importantes ya fueron tomadas. Los reportes explican lo que pasó, pero a menudo cuando la oportunidad de la dirección de cambiar el resultado ya pasó.',
          'PRO CORP parte de una idea diferente: un negocio es un sistema vivo. Clientes, personas, capital, procesos, reglas, información y tecnología se afectan constantemente entre sí. Para cambiar el negocio, la dirección debe primero entender cómo funciona realmente ese sistema.',
          'Por eso PRO CORP no se trata de un producto, una solución predeterminada ni una herramienta de IA buscando un uso. Comienza con el negocio — y con la decisión trascendental que la dirección necesita tomar.',
        ],
      },
      {
        h: 'Hacer visible el negocio',
        ps: [
          'La primera tarea es ver el negocio tal como opera, no solo como aparece en los organigramas o en los reportes históricos. Eso significa conectar información, exponer relaciones e identificar las fuerzas que crean valor o lo impiden: demanda, precio, capacidad, capital, personas, procesos, riesgo, regulación, tecnología y tiempo.',
          'El momento importa. La información precisa puede ser inútil si llega después de la oportunidad de actuar. Por eso PRO CORP se enfoca en la visibilidad al momento de decidir: entregar la información correcta a la velocidad que la decisión requiere. No toda señal debe ser instantánea. Toda señal importante debe llegar mientras la dirección aún puede influir en el resultado.',
          'Ver antes crea espacio para decidir. Pero ver lo que está pasando es solo el comienzo.',
        ],
      },
      {
        h: 'Hacer comprobable el futuro',
        ps: [
          'Una vez el negocio es visible, PRO CORP modela cómo se conectan sus partes esenciales. Un modelo obliga a la claridad. Revela supuestos, dependencias y restricciones que de otro modo son fáciles de pasar por alto.',
          'La simulación hace útil ese entendimiento. La dirección puede cambiar un supuesto, explorar una alternativa y observar cómo podría responder el sistema. En lugar de pretender predecir un futuro inevitable, PRO CORP ayuda a los líderes a comparar futuros plausibles y probar decisiones trascendentales antes de comprometer capital, personas o tiempo.',
          'La visibilidad en tiempo real revela qué está cambiando. La simulación ayuda a la dirección a entender qué podrían significar esos cambios. Juntas, extienden la distancia entre reconocer una posibilidad y verse obligado a vivir con sus consecuencias.',
        ],
      },
      {
        h: 'Ingeniar una sola respuesta que funcione',
        ps: [
          'Entender el negocio y explorar alternativas no basta. El camino elegido debe sobrevivir al mundo real.',
          'PRO CORP llama a esto Ingeniería de Negocios: la disciplina de hacer un negocio comprensible, sus alternativas comprobables y su futuro elegido ejecutable. Reúne estrategia, diseño operativo, pensamiento comercial, restricciones legales e institucionales, datos, tecnología e implementación en la misma decisión.',
          'Toda transformación propuesta debe pasar tres pruebas. Debe ser valiosa, creando valor comercial, financiero o estratégico significativo. Debe ser permisible, capaz de operar dentro del entorno legal, regulatorio e institucional relevante, con asesores calificados involucrados donde se requiera juicio legal profesional. Y debe ser ejecutable, respaldada por las personas, los procesos, la tecnología y el capital necesarios para hacerla realidad.',
          'El cliente no necesita recomendaciones desconectadas. Necesita un solo camino responsable que funcione.',
        ],
      },
      {
        h: 'Sin fronteras por diseño',
        ps: [
          'La Ingeniería de Negocios no es un servicio de un sector específico. Es la filosofía que PRO CORP aplica a cada oportunidad de negocio, en cualquier mercado vertical y cualquier geografía. El sujeto cambia; la disciplina no. Cada oportunidad sigue siendo un sistema por entender, un conjunto de posibilidades por probar y un camino por ingeniar.',
          'Esa oportunidad puede ser un proyecto de desarrollo inmobiliario en Colombia, donde tierra, demanda de mercado, capital, permisos y ejecución deben convertirse en un solo plan viable. Puede ser un evento inmersivo de educación y entretenimiento en España, donde la experiencia, la audiencia, la economía, las operaciones y la tecnología deben reforzarse entre sí. Puede ser una solución de ciudadanía y servicios legales para clientes en Europa, diseñada alrededor de un recorrido claro del cliente mientras profesionales legales calificados atienden los requisitos legales relevantes.',
          'La misma filosofía puede aplicarse a la monetización y resolución legal de un activo en dificultades bajo ejecución hipotecaria; a un simulador financiero con análisis Monte Carlo en Portugal; o a un portal privado seguro que captura y gestiona información de distintos sistemas para una empresa en riesgo. Estas oportunidades pertenecen a industrias y países diferentes, pero cada una requiere el mismo trabajo fundamental: ver el sistema completo, entender sus restricciones, probar las alternativas, diseñar una solución integrada y ejecutarla en el mundo real.',
          'PRO CORP es una boutique. Su fortaleza no es un inventario estrecho atado a un mercado. Su inventario de procesos, patrones y soluciones no tiene fronteras — de geografía ni de industria — y se recombina alrededor de la realidad específica de cada cliente.',
        ],
      },
      {
        h: 'Co-ingeniado con el cliente',
        ps: [
          'Esa amplitud no significa llegar con una respuesta universal. PRO CORP nunca inicia un proyecto sin la participación directa del cliente. El cliente posee el conocimiento operativo, el contexto, el criterio y la realidad institucional que ningún equipo externo puede fabricar.',
          'Por eso, la Ingeniería de Negocios se hace de la mano de la dirección y de las personas más cercanas al trabajo. Juntos, PRO CORP y el cliente definen la decisión trascendental, examinan el sistema, cuestionan supuestos, prueban alternativas y construyen el camino a seguir. La participación del cliente no es una consulta ceremonial; es parte del método de ingeniería.',
          'Sin participación no hay apropiación. Sin apropiación no hay compromiso. Sin compromiso, incluso un diseño inteligente se queda en media solución.',
        ],
      },
      {
        h: 'De la decisión a la realidad',
        ps: [
          'PRO CORP comienza con una decisión trascendental. Ve el negocio tal como es, modela el sistema, simula alternativas, ayuda a la dirección a decidir, ingenia el camino comercial y operativo, ejecuta el cambio y aprende de la realidad.',
          'La tecnología sirve a este proceso. Conecta capacidades, integra información fragmentada, automatiza trabajo cuando la automatización crea valor y soporta nuevos modelos operativos. Es el instrumento, no el destino.',
          'La IA es un acelerador. Puede reconocer patrones, entender información, generar alternativas, asistir decisiones, automatizar trabajo y coordinar acción. Pero la IA no hace fuerte un modelo operativo débil. Aplicada al proceso equivocado, acelera el proceso equivocado. PRO CORP aplica IA solo donde mejora la calidad, la velocidad o el alcance de una decisión de negocio gobernada.',
          'La ejecución es lo que marca la diferencia. Entender sin actuar no cambia nada. Simular sin decidir no cambia nada. La estrategia sin implementación no cambia nada. La tecnología sin adopción no cambia nada.',
          'Por eso PRO CORP prototipa, integra, implementa, mide y adapta. Cuando la realidad revela algo que el modelo no mostró, el aprendizaje se vuelve parte de la siguiente decisión.',
        ],
      },
      {
        h: 'Nuestra Promesa',
        ps: [
          'PRO CORP existe para ayudar a la dirección a ver antes, probar antes de comprometerse y ejecutar lo que funciona. Su propósito no es imponer tecnología a una empresa. Es ayudar a la empresa a entender lo que podría llegar a ser — y luego ingeniar un camino creíble de la decisión a la realidad.',
          'Los mejores negocios no se crean solo con entendimiento. Se vuelven posibles cuando el entendimiento, la decisión y la ejecución operan como un solo sistema.',
        ],
      },
    ],
    closing: 'Ingeniamos negocios.',
  },
  pt: {
    label: 'Manifesto',
    title: 'O Negócio Antes da Tecnologia',
    subtitle: 'Um compromisso conciso com a Engenharia de Negócios',
    sections: [
      {
        ps: [
          'A maioria das empresas não sofre por falta de informação, ideias ou tecnologia. Sofre porque esses elementos estão fragmentados. A estratégia está separada das operações. A análise jurídica chega separada da ambição comercial. As equipes de tecnologia recebem requisitos depois que as decisões importantes já foram tomadas. Os relatórios explicam o que aconteceu, mas muitas vezes depois que a oportunidade da gestão de mudar o resultado já passou.',
          'A PRO CORP parte de uma ideia diferente: um negócio é um sistema vivo. Clientes, pessoas, capital, processos, regras, informação e tecnologia afetam-se constantemente. Para mudar o negócio, a gestão precisa primeiro entender como esse sistema realmente funciona.',
          'Por isso a PRO CORP não é um produto, uma solução predeterminada nem uma ferramenta de IA em busca de um uso. Começa com o negócio — e com a decisão consequente que a gestão precisa tomar.',
        ],
      },
      {
        h: 'Tornar o negócio visível',
        ps: [
          'A primeira tarefa é ver o negócio como ele opera, não apenas como aparece nos organogramas ou nos relatórios históricos. Isso significa conectar informação, expor relações e identificar as forças que criam valor ou o impedem: demanda, preço, capacidade, capital, pessoas, processos, risco, regulação, tecnologia e tempo.',
          'O momento importa. Informação precisa ainda pode ser inútil se chegar depois da oportunidade de agir. Por isso a PRO CORP foca na visibilidade no momento da decisão: entregar a informação certa na velocidade que a decisão exige. Nem todo sinal precisa ser instantâneo. Todo sinal importante deve chegar enquanto a gestão ainda pode influenciar o resultado.',
          'Ver antes cria espaço para decidir. Mas ver o que está acontecendo é apenas o começo.',
        ],
      },
      {
        h: 'Tornar o futuro testável',
        ps: [
          'Uma vez que o negócio é visível, a PRO CORP modela como suas partes essenciais se conectam. Um modelo obriga à clareza. Revela premissas, dependências e restrições que, de outro modo, são fáceis de ignorar.',
          'A simulação torna esse entendimento útil. A gestão pode mudar uma premissa, explorar uma alternativa e observar como o sistema pode responder. Em vez de fingir prever um futuro inevitável, a PRO CORP ajuda os líderes a comparar futuros plausíveis e testar escolhas consequentes antes de comprometer capital, pessoas ou tempo.',
          'A visibilidade em tempo real revela o que está mudando. A simulação ajuda a gestão a entender o que essas mudanças podem significar. Juntas, ampliam a distância entre reconhecer uma possibilidade e ser forçado a viver com suas consequências.',
        ],
      },
      {
        h: 'Engenhar uma única resposta que funcione',
        ps: [
          'Entender o negócio e explorar alternativas não basta. O caminho escolhido precisa sobreviver ao mundo real.',
          'A PRO CORP chama isso de Engenharia de Negócios: a disciplina de tornar um negócio compreensível, suas alternativas testáveis e seu futuro escolhido executável. Reúne estratégia, desenho operacional, pensamento comercial, restrições legais e institucionais, dados, tecnologia e implementação na mesma decisão.',
          'Toda transformação proposta deve passar por três testes. Deve ser valiosa, criando valor comercial, financeiro ou estratégico significativo. Deve ser permissível, capaz de operar dentro do ambiente legal, regulatório e institucional relevante, com assessores qualificados envolvidos onde o julgamento jurídico profissional for necessário. E deve ser executável, sustentada pelas pessoas, processos, tecnologia e capital necessários para torná-la real.',
          'O cliente não precisa de recomendações desconectadas. Precisa de um único caminho responsável que funcione.',
        ],
      },
      {
        h: 'Sem fronteiras por desenho',
        ps: [
          'A Engenharia de Negócios não é um serviço de um setor específico. É a filosofia que a PRO CORP aplica a cada oportunidade de negócio, em qualquer mercado vertical e qualquer geografia. O objeto muda; a disciplina não. Cada oportunidade continua sendo um sistema a entender, um conjunto de possibilidades a testar e um caminho a engenhar.',
          'Essa oportunidade pode ser um projeto de desenvolvimento imobiliário na Colômbia, onde terreno, demanda de mercado, capital, licenças e execução precisam se tornar um único plano viável. Pode ser um evento imersivo de educação e entretenimento na Espanha, onde experiência, público, economia, operações e tecnologia precisam se reforçar mutuamente. Pode ser uma solução de cidadania e serviços jurídicos para clientes na Europa, desenhada em torno de uma jornada clara do cliente enquanto profissionais jurídicos qualificados atendem aos requisitos legais relevantes.',
          'A mesma filosofia pode ser aplicada à monetização e resolução legal de um ativo em dificuldade sob execução hipotecária; a um simulador financeiro com análise de Monte Carlo em Portugal; ou a um portal privado seguro que captura e gerencia informações de diferentes sistemas para uma empresa em risco. Essas oportunidades pertencem a indústrias e países diferentes, mas cada uma exige o mesmo trabalho fundamental: ver o sistema inteiro, entender suas restrições, testar as alternativas, desenhar uma solução integrada e executá-la no mundo real.',
          'A PRO CORP é uma boutique. Sua força não é um inventário estreito preso a um mercado. Seu inventário de processos, padrões e soluções não tem fronteiras — de geografia nem de indústria — e é recombinado em torno da realidade específica de cada cliente.',
        ],
      },
      {
        h: 'Coengenhado com o cliente',
        ps: [
          'Essa amplitude não significa chegar com uma resposta universal. A PRO CORP nunca inicia um projeto sem o envolvimento direto do cliente. O cliente detém o conhecimento operacional, o contexto, o critério e a realidade institucional que nenhuma equipe externa pode fabricar.',
          'Por isso, a Engenharia de Negócios é feita de mãos dadas com a gestão e com as pessoas mais próximas do trabalho. Juntos, PRO CORP e cliente definem a decisão consequente, examinam o sistema, questionam premissas, testam alternativas e constroem o caminho a seguir. A participação do cliente não é uma consulta cerimonial; é parte do método de engenharia.',
          'Sem envolvimento não há apropriação. Sem apropriação não há compromisso. Sem compromisso, até um desenho inteligente se torna apenas meia solução.',
        ],
      },
      {
        h: 'Da decisão à realidade',
        ps: [
          'A PRO CORP começa com uma decisão consequente. Vê o negócio como ele é, modela o sistema, simula alternativas, ajuda a gestão a decidir, engenha o caminho comercial e operacional, executa a mudança e aprende com a realidade.',
          'A tecnologia serve a esse processo. Conecta capacidades, integra informação fragmentada, automatiza trabalho quando a automação cria valor e sustenta novos modelos operacionais. É o instrumento, não o destino.',
          'A IA é um acelerador. Pode reconhecer padrões, entender informação, gerar alternativas, apoiar decisões, automatizar trabalho e coordenar ação. Mas a IA não torna forte um modelo operacional fraco. Aplicada ao processo errado, acelera o processo errado. A PRO CORP aplica IA apenas onde ela melhora a qualidade, a velocidade ou o alcance de uma decisão de negócio governada.',
          'A execução é o que faz a diferença. Entender sem agir não muda nada. Simular sem decidir não muda nada. Estratégia sem implementação não muda nada. Tecnologia sem adoção não muda nada.',
          'Por isso a PRO CORP prototipa, integra, implementa, mede e adapta. Quando a realidade revela algo que o modelo não mostrou, o aprendizado se torna parte da próxima decisão.',
        ],
      },
      {
        h: 'Nossa Promessa',
        ps: [
          'A PRO CORP existe para ajudar a gestão a ver antes, testar antes de se comprometer e executar o que funciona. Seu propósito não é impor tecnologia a uma empresa. É ajudar a empresa a entender o que ela poderia se tornar — e então engenhar um caminho crível da decisão à realidade.',
          'Negócios melhores não são criados apenas com entendimento. Tornam-se possíveis quando entendimento, escolha e execução operam como um único sistema.',
        ],
      },
    ],
    closing: 'Engenhamos negócios.',
  },
};

export default function ProCorpStory() {
  const { lang } = useLanguage();
  const c = STORY[(lang as Lang) in STORY ? (lang as Lang) : 'en'];
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close]);

  return (
    <>
      {/* Icono flotante a la izquierda */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={c.label}
        className="group fixed left-4 top-1/2 z-40 -translate-y-1/2 flex items-center gap-0 rounded-full border border-primary/40 bg-surface-dark/80 backdrop-blur-md p-3.5 text-primary-light shadow-[0_0_20px_rgba(206,16,38,0.25)] transition-all hover:border-primary hover:bg-primary hover:text-white hover:shadow-[0_0_30px_rgba(206,16,38,0.5)]"
      >
        <span className="material-symbols-outlined text-[26px]">auto_stories</span>
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-bold uppercase tracking-widest opacity-0 transition-all duration-300 group-hover:ml-3 group-hover:max-w-[220px] group-hover:opacity-100">
          {c.label}
        </span>
      </button>

      {/* Lector del documento */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] overflow-y-auto bg-black/85 backdrop-blur-md px-4 py-8 md:px-6 md:py-12"
            onClick={(e) => e.target === e.currentTarget && close()}
          >
            <motion.article
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="relative mx-auto max-w-3xl rounded-[2rem] border border-surface-border/70 bg-background-dark/95 p-8 shadow-2xl md:p-14"
            >
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-primary hover:text-white"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>

              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.35em] text-primary">{c.label}</p>
              <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">{c.title}</h1>
              <p className="mt-3 text-base italic text-gray-400 md:text-lg">{c.subtitle}</p>
              <div className="mt-8 h-px w-full bg-gradient-to-r from-primary/60 via-surface-border to-transparent" />

              {c.sections.map((s, i) => (
                <section key={s.h ?? i} className="mt-10">
                  {s.h && (
                    <h2 className="mb-4 text-xl font-extrabold uppercase tracking-wide text-primary-light md:text-2xl">
                      {s.h}
                    </h2>
                  )}
                  <div className="space-y-4">
                    {s.ps.map((p) => (
                      <p key={p.slice(0, 40)} className="text-[15px] font-light leading-relaxed text-gray-300 md:text-base">
                        {p}
                      </p>
                    ))}
                  </div>
                </section>
              ))}

              <p className="mt-14 text-center font-display text-2xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
                {c.closing}
              </p>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
