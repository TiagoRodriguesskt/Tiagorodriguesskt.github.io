/* =========================================================
   Badges e certificado
   ---------------------------------------------------------
   Este arquivo só guarda DADOS. Quem desenha a seção
   Mainframe e o comando "certificados" do terminal é o
   script.js (bloco 9), a partir destas listas.

   Ganhou um badge? Ache a linha dele em BADGES e:
     1. troque  status: 'andamento'  por  status: 'concluido'
     2. preencha data (ano-mês), link (da página do badge no
        Credly) e img (a imagem do badge no Credly)
   O progresso, os contadores e o terminal se atualizam sozinhos.
   ========================================================= */

// O programa do curso e o certificado final
const PROGRAMA = {
  nome: 'IBM Z Global Skills Accelerator Program',
  trilha: 'Mainframe System Administrator · Level 1',
  previsao: '2027-08',            // quando o certificado deve sair
  certificado: {
    nome: 'Certificate of Achievement · Mainframe System Administrator Level 1',
    status: 'andamento',          // troque por 'concluido' quando receber
    data: '',
    link: '',                     // link do certificado, quando houver
  },
};

// Os grupos, na ordem em que aparecem no site
const GRUPOS = [
  { id: 'fundamentos', nome: 'Fundamentos', programa: true, descricao: 'cursos fundamentais do programa' },
  { id: 'nucleo',      nome: 'Núcleo',      programa: true, descricao: 'cursos principais do programa (Core)' },
  { id: 'conclusao',   nome: 'Conclusão',   programa: true, descricao: 'badge recebido ao concluir o programa' },
  { id: 'outros',      nome: 'Aprendizado contínuo', programa: false, descricao: 'badges fora do programa' },
];

// nivel: 'fundamental' | 'intermediario' | 'avancado' | 'certificado' | '' (sem nível)
const BADGES = [
  // ---------- Fundamentos (12) ----------
  { grupo: 'fundamentos', nome: 'Explore Emerging Tech', emissor: 'IBM SkillsBuild', nivel: '',
    status: 'concluido', data: '2026-08',
    link: 'https://www.credly.com/badges/3806060d-910d-408a-9ab9-74109721594d',
    img: 'https://images.credly.com/images/cfd8fce1-08b2-4d7b-97e1-f54a48adacaf/Explore_20Emerging_20Tech_201.png' },
  { grupo: 'fundamentos', nome: 'IBM Z Xplore – Concepts', emissor: 'IBM', nivel: 'intermediario',
    status: 'concluido', data: '2026-08',
    link: 'https://www.credly.com/badges/c353835b-0a8e-44a2-a3b6-5e7237c2a65e',
    img: 'https://images.credly.com/images/0f3e4162-ab6b-457c-8c0d-835a14680666/image.png' },
  { grupo: 'fundamentos', nome: 'IBM Z Xplore – Advanced', emissor: 'IBM', nivel: 'avancado',
    status: 'concluido', data: '2026-09',
    link: 'https://www.credly.com/badges/24d3e81d-91b2-4804-b36f-99b4ed5b8028',
    img: 'https://images.credly.com/images/9dde9b48-6cec-4bc4-ab33-ffeac5c681c3/image.png' },
  { grupo: 'fundamentos', nome: 'Introduction to IBM z/OS', emissor: 'IBM', nivel: 'fundamental',
    status: 'concluido', data: '2026-08',
    link: 'https://www.credly.com/badges/2311e1ea-5290-42ce-a82a-d79654c05ae3',
    img: 'https://images.credly.com/images/7bfcd4c3-3b81-41db-8396-12037b44fae7/image.png' },
  { grupo: 'fundamentos', nome: 'Introduction to z/OS Commands and Panels on IBM Z', emissor: 'IBM', nivel: 'intermediario',
    status: 'concluido', data: '2026-08',
    link: 'https://www.credly.com/badges/9561670a-125a-41cd-a893-30dd6046b777',
    img: 'https://images.credly.com/images/c29eff7b-eeab-43f8-8ef7-d7943cf65dcd/image.png' },
  { grupo: 'fundamentos', nome: 'Introduction to System Programming on IBM Z', emissor: 'IBM', nivel: 'intermediario',
    status: 'concluido', data: '2026-08',
    link: 'https://www.credly.com/badges/bab742b8-7f63-4640-97d0-5e9502c3e470',
    img: 'https://images.credly.com/images/067d8a35-4668-4f66-a6e2-e77ecb857da9/image.png' },
  { grupo: 'fundamentos', nome: 'IBM z/OS Mainframe Practitioner', emissor: 'IBM', nivel: 'certificado',
    status: 'concluido', data: '2026-08',
    link: 'https://www.credly.com/badges/74f652c9-28e4-44cb-8482-97cf418e15de',
    img: 'https://images.credly.com/images/3c94ec71-118c-48c0-8ffd-58af4fb5bc12/IBM_Certificate_-_zOS_Mainframe_Practitioner.png' },
  { grupo: 'fundamentos', nome: 'Introducing z/OS UNIX System Services', emissor: 'IBM', nivel: 'intermediario',
    status: 'concluido', data: '2026-08',
    link: 'https://www.credly.com/badges/ff859235-b513-46f2-9f09-2d1ff9b5d9d9',
    img: 'https://images.credly.com/images/3b863758-8c39-4b26-8a84-12a958ae2ff4/image.png' },
  { grupo: 'fundamentos', nome: 'Agile Explorer', emissor: 'IBM SkillsBuild', nivel: '',
    status: 'concluido', data: '2026-10',
    link: 'https://www.credly.com/badges/55c95cf2-39e3-4d6a-9264-0392304298b8',
    img: 'https://images.credly.com/images/3b7846e2-bdbd-4ed6-8543-182f47502190/image.png' },
  { grupo: 'fundamentos', nome: 'Working in a Digital World: Professional Skills', emissor: 'IBM SkillsBuild', nivel: '',
    status: 'andamento', data: '', link: '', img: '' },
  { grupo: 'fundamentos', nome: 'Enterprise Design Thinking Practitioner', emissor: 'IBM', nivel: '',
    status: 'andamento', data: '', link: '', img: '' },
  { grupo: 'fundamentos', nome: 'IBM Z 101 Certificate', emissor: 'IBM', nivel: 'certificado',
    status: 'concluido', data: '2026-09',
    link: 'https://www.credly.com/badges/bd32d07b-ea5f-434b-98d3-a2bb422480fd',
    img: 'https://images.credly.com/images/22acc75c-8099-4403-a558-89478ae937cc/IBM_20Z_20101_20Professional_20Certificate.png' },

  // ---------- Núcleo / Core (14) ----------
  { grupo: 'nucleo', nome: 'Mainframe Specialist – Job Control Language – Foundations 3.1', emissor: 'IBM · Interskill', nivel: 'fundamental',
    status: 'andamento', data: '', link: '', img: '' },
  { grupo: 'nucleo', nome: 'z/OS REXX Programming', emissor: 'IBM', nivel: 'intermediario',
    status: 'andamento', data: '', link: '', img: '' },
  { grupo: 'nucleo', nome: 'TCP/IP on z/OS Essentials Level 1', emissor: 'IBM', nivel: 'fundamental',
    status: 'andamento', data: '', link: '', img: '' },
  { grupo: 'nucleo', nome: 'Networking on z/OS – Foundations', emissor: 'IBM', nivel: 'fundamental',
    status: 'andamento', data: '', link: '', img: '' },
  { grupo: 'nucleo', nome: 'z/OS System Services Structure', emissor: 'IBM', nivel: 'intermediario',
    status: 'andamento', data: '', link: '', img: '' },
  { grupo: 'nucleo', nome: 'IBM z/OS Security Essentials', emissor: 'IBM', nivel: 'fundamental',
    status: 'andamento', data: '', link: '', img: '' },
  { grupo: 'nucleo', nome: 'SMP/E for z/OS Workshop', emissor: 'IBM', nivel: 'fundamental',
    status: 'andamento', data: '', link: '', img: '' },
  { grupo: 'nucleo', nome: 'Mainframe Specialist – Disk and Tape Storage – Foundations z/OS 3.1', emissor: 'IBM · Interskill', nivel: 'fundamental',
    status: 'andamento', data: '', link: '', img: '' },
  { grupo: 'nucleo', nome: 'Mainframe Specialist – Data Management Using DFSMS – Experienced z/OS 3.1', emissor: 'IBM · Interskill', nivel: 'intermediario',
    status: 'andamento', data: '', link: '', img: '' },
  { grupo: 'nucleo', nome: 'Mainframe Operator CICS TS 6.2 Operations', emissor: 'IBM · Interskill', nivel: 'intermediario',
    status: 'andamento', data: '', link: '', img: '' },
  { grupo: 'nucleo', nome: 'Mainframe Specialist – Db2 V13 Operations', emissor: 'IBM · Interskill', nivel: 'avancado',
    status: 'andamento', data: '', link: '', img: '' },
  { grupo: 'nucleo', nome: 'Mainframe Security – Foundations z/OS 3.1', emissor: 'IBM · Interskill', nivel: 'fundamental',
    status: 'andamento', data: '', link: '', img: '' },
  { grupo: 'nucleo', nome: 'IBM Z Resiliency', emissor: 'IBM', nivel: 'fundamental',
    status: 'andamento', data: '', link: '', img: '' },
  { grupo: 'nucleo', nome: 'Mainframe Systems Administrator 201', emissor: 'IBM', nivel: 'certificado',
    status: 'andamento', data: '', link: '', img: '' },

  // ---------- Conclusão (1) ----------
  { grupo: 'conclusao', nome: 'IBM Z Global Skills Accelerator Program – Mainframe System Administrator – Level 1', emissor: 'IBM', nivel: 'certificado',
    status: 'andamento', data: '', link: '', img: '' },

  // ---------- Fora do programa ----------
  { grupo: 'outros', nome: 'AI Literacy', emissor: 'IBM SkillsBuild', nivel: '',
    status: 'concluido', data: '2026-11',
    link: 'https://www.credly.com/badges/26803b24-b479-4797-aa8a-fd1a4b371248',
    img: 'https://images.credly.com/images/bc70837c-99ae-499d-a31d-2a7be79095e6/BadgeEmblem_AILiteracy.png' },
  { grupo: 'outros', nome: 'Lifelong Learning 2026', emissor: 'Certiprof', nivel: '',
    status: 'concluido', data: '2026-04', validade: '2027-04',
    link: 'https://www.credly.com/badges/a676e343-b91a-4387-a344-15dd038f9f1b',
    img: 'https://images.credly.com/images/5e2afabf-62f3-48ae-bbed-7e57c2e78c6a/blob' },
];
