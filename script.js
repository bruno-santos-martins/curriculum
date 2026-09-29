document.addEventListener('DOMContentLoaded', () => {
  /* ==============================================
     1. Sticky Header
     ============================================== */
  const header = document.querySelector('.header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  /* ==============================================
     2. Mobile Menu Toggle
     ============================================== */
  const menuToggle = document.getElementById('mobile-menu');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav-link');

  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    const icon = menuToggle.querySelector('i');
    if (nav.classList.contains('open')) {
      icon.classList.remove('ph-list');
      icon.classList.add('ph-x');
    } else {
      icon.classList.remove('ph-x');
      icon.classList.add('ph-list');
    }
  });

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      const icon = menuToggle.querySelector('i');
      icon.classList.remove('ph-x');
      icon.classList.add('ph-list');
    });
  });

  /* ==============================================
     3. Active Menu Link on Scroll
     ============================================== */
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  /* ==============================================
     4. Reveal Animations (Intersection Observer)
     ============================================== */
  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-in');

  const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      }
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    });
  }, revealOptions);

  revealElements.forEach(el => {
    revealOnScroll.observe(el);
  });

  /* ==============================================
     5. Skill Tooltips (onde cada tecnologia foi aplicada)
     ============================================== */
  const skillContext = {
    'React.js': 'Spun Mídia (biblioteca UI com Storybook), Opah IT (componentes reutilizáveis) e SysMap (plataforma educacional).',
    'Next.js': 'Opah IT em soluções financeiras (SSR/SSG) e SysMap na plataforma de cursos/matrizes curriculares.',
    'Angular.js': 'Avanade no Hospital Einstein (sustentação em Angular 7) e AllNet em projetos legados com AngularJS.',
    'Tailwind CSS': 'Opah IT no fluxo de Design System e construção de componentes front-end entre squads.',
    'Storybook': 'Spun Mídia e Opah IT na documentação e evolução de Design System para acelerar entregas.',
    'TypeScript': 'Opah IT em produtos Full Stack com Next.js/NestJS e contratos de front-end mais previsíveis.',
    'HTML5 / CSS3': 'AllNet (PWA operacional, IoT e portal), Prefeitura RJ (sistemas de saúde) e projetos web corporativos.',
    'Node.js': 'Spun Mídia (IAM), Opah IT (setor financeiro), Compass/Sem Parar, SysMap (educação), Avanade e AllNet.',
    'NestJS': 'Opah IT (APIs financeiras) e Compass.uol no projeto Sem Parar com foco em escalabilidade.',
    'PHP': 'AllNet e Prefeitura do Rio na evolução de sistemas internos e plataformas públicas de saúde.',
    'MongoDB': 'AllNet no painel de cartões Sodexo com automações e monitoramento de dados.',
    'MySQL': 'SysMap (com Prisma), Avanade (Natura), AllNet (portal/API) e Prefeitura RJ (SINAN e ambulância).',
    'DynamoDB': 'Compass.uol (Sem Parar) e Avanade (Natura) em cenários de integração e alta disponibilidade.',
    'Prisma ORM': 'SysMap Solutions na plataforma educacional para modelagem e evolução de dados.',
    'Apache Kafka': 'SysMap Solutions na mensageria assíncrona entre módulos da plataforma educacional.',
    'AWS Lambda': 'Compass.uol no projeto Sem Parar com arquitetura serverless e foco em performance.',
    'Serverless': 'Compass.uol em Sem Parar (Lambda + DynamoDB) para ganho de escala e eficiência operacional.',
    'Scrum / Kanban': 'Aplicado em Opah IT e demais squads para entregas contínuas e alinhamento com produto/negócio.',
    'Arquitetura Hexagonal': 'SysMap Solutions na plataforma de cursos para separar domínio, interfaces e integrações.',
    'Puppeteer': 'AllNet no projeto de monitoramento de cartões Sodexo com captura automatizada de dados.'
  };

  const skillTags = document.querySelectorAll('.skill-tag');
  const tooltip = document.createElement('div');
  tooltip.className = 'skill-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  document.body.appendChild(tooltip);

  function getTooltipText(tag) {
    const key = tag.textContent.trim();
    return skillContext[key] || 'Tecnologia aplicada em projetos reais com foco em escala, qualidade e entrega continua.';
  }

  function showTooltip(event, tag) {
    tooltip.textContent = getTooltipText(tag);
    tooltip.classList.add('visible');
    positionTooltip(event);
  }

  function hideTooltip() {
    tooltip.classList.remove('visible');
  }

  function positionTooltip(event) {
    const gap = 16;
    const tooltipRect = tooltip.getBoundingClientRect();
    let left = event.clientX + gap;
    let top = event.clientY + gap;

    if (left + tooltipRect.width > window.innerWidth - 12) {
      left = event.clientX - tooltipRect.width - gap;
    }

    if (top + tooltipRect.height > window.innerHeight - 12) {
      top = event.clientY - tooltipRect.height - gap;
    }

    tooltip.style.left = `${Math.max(12, left)}px`;
    tooltip.style.top = `${Math.max(12, top)}px`;
  }

  skillTags.forEach((tag) => {
    tag.setAttribute('tabindex', '0');

    tag.addEventListener('mouseenter', (event) => showTooltip(event, tag));
    tag.addEventListener('mousemove', (event) => positionTooltip(event));
    tag.addEventListener('mouseleave', hideTooltip);

    tag.addEventListener('focus', () => {
      const rect = tag.getBoundingClientRect();
      const fakeEvent = {
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2
      };
      showTooltip(fakeEvent, tag);
    });
    tag.addEventListener('blur', hideTooltip);
  });
});
