import "./App.css";
import { useState, useEffect, useRef, useMemo } from "react";

function App() {
  const [activeSection, setActiveSection] = useState("hero");
  const rafId = useRef(null);

  const sections = useMemo(
    () => [
      { id: "hero", label: "Inicio" },
      { id: "about", label: "Sobre mí" },
      { id: "skills", label: "Habilidades" },
      // { id: "projects", label: "Proyectos" },
      { id: "contact", label: "Contacto" },
    ],
    []
  );

  useEffect(() => {
    const sectionIds = sections.map((s) => s.id);

    const updateTimelineBounds = () => {
      const nav = document.querySelector(".timeline-nav");
      if (!nav) return;
      const dots = nav.querySelectorAll(".timeline-dot");
      if (dots.length < 2) return;

      const navRect = nav.getBoundingClientRect();
      const firstRect = dots[0].getBoundingClientRect();
      const lastRect = dots[dots.length - 1].getBoundingClientRect();

      const start = Math.round(
        firstRect.top + firstRect.height / 2 - navRect.top
      );
      const end = Math.round(lastRect.top + lastRect.height / 2 - navRect.top);

      nav.style.setProperty("--timeline-start", `${start}px`);
      nav.style.setProperty("--timeline-end", `${end}px`);
    };

    const updateProgress = () => {
      const scrollAnchor = window.scrollY + 100;
      const docEl = document.documentElement;
      const windowHeight = window.innerHeight;
      const documentHeight = docEl.scrollHeight;

      const infos = sectionIds
        .map((id) => {
          const el = document.getElementById(id);
          if (!el) return null;
          const top = el.offsetTop;
          const height = el.offsetHeight || 1;
          return { id, top, height, bottom: top + height };
        })
        .filter(Boolean);

      if (!infos.length) return;

      const isAtBottom = window.scrollY + windowHeight >= documentHeight - 50;

      let idx = 0;
      for (let i = 0; i < infos.length; i++) {
        if (scrollAnchor >= infos[i].top) idx = i;
      }

      let inner = Math.min(
        1,
        Math.max(0, (scrollAnchor - infos[idx].top) / infos[idx].height)
      );

      if (isAtBottom || idx === infos.length - 1) {
        idx = infos.length - 1;
        inner = isAtBottom ? 1 : inner;
      }

      const progress =
        infos.length > 1 ? (idx + inner) / (infos.length - 1) : 1;

      setActiveSection(infos[idx].id);
      document.documentElement.setAttribute(
        "data-active-section",
        infos[idx].id
      ); // <- añade esto
      const timelineNav = document.querySelector(".timeline-nav");
      if (timelineNav) {
        timelineNav.style.setProperty(
          "--scroll-progress-ratio",
          String(Math.min(1, Math.max(0, progress)))
        );
      }
    };

    const handleScroll = () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(updateProgress);
    };

    const handleResize = () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        updateTimelineBounds();
        updateProgress();
      });
    };

    // Inicializa límites y progreso
    requestAnimationFrame(() => {
      updateTimelineBounds();
      updateProgress();
    });

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [sections]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyNavItem = (e, id) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      scrollToSection(id);
    }
  };

  return (
    <div className="portfolio">
      {/* Navegación Timeline */}
      <nav
        className="timeline-nav"
        role="navigation"
        aria-label="Timeline de secciones"
      >
        <div className="timeline-line"></div>
        {sections.map((section, idx) => {
          const isActive = activeSection === section.id;
          const activeIdx = sections.findIndex((s) => s.id === activeSection);
          const isVisited = idx < activeIdx;
          return (
            <div
              key={section.id}
              className={`timeline-item${isActive ? " active" : ""}${
                isVisited ? " visited" : ""
              }`}
              role="button"
              tabIndex={0}
              aria-label={section.label}
              aria-current={isActive ? "true" : undefined}
              onClick={() => scrollToSection(section.id)}
              onKeyDown={(e) => handleKeyNavItem(e, section.id)}
            >
              <div
                className={`timeline-dot${isActive ? " active" : ""}${
                  isVisited ? " visited" : ""
                }`}
              />
            </div>
          );
        })}
      </nav>

      {/* Sección Hero */}
      <section id="hero" className="hero-section">
        <div className="hero-content">
          <h1 className="hero-name">Noé Alejandro</h1>
          <p className="hero-subtitle">Desarrollador Fullstack</p>
          <div className="scroll-indicator">
            <span>Scroll para conocer más</span>
            <div className="scroll-arrow">↓</div>
          </div>
        </div>
      </section>

      {/* Sección Sobre mí */}
      <section id="about" className="about-section">
        <div className="container">
          <h2>Sobre mí</h2>
          <p>
            Soy un desarrollador con experiencia en el desarrollo de
            aplicaciones web, móviles, y de escritorio, manejando tanto el
            frontend como el backend.
          </p>
        </div>
      </section>

      {/* Sección Habilidades */}
      <section id="skills" className="skills-section">
        <div className="container">
          <h2>Habilidades</h2>

          <div className="skills-grid">
            {/* Backend */}
            <div className="skill-category">
              <h3>Backend</h3>
              <div className="skills-icons">
                <img
                  src="https://skillicons.dev/icons?i=laravel"
                  alt="Laravel"
                />
                <img src="https://skillicons.dev/icons?i=php" alt="PHP" />
                <img
                  src="https://skillicons.dev/icons?i=typescript"
                  alt="TypeScript"
                />
                <img
                  src="https://skillicons.dev/icons?i=nodejs"
                  alt="Node.js"
                />
              </div>
              <p>Laravel PHP, Node.js, TypeScript, APIs REST</p>
            </div>

            {/* Frontend Web */}
            <div className="skill-category">
              <h3>Frontend Web</h3>
              <div className="skills-icons">
                <img src="https://skillicons.dev/icons?i=react" alt="React" />
                <img src="https://skillicons.dev/icons?i=html" alt="HTML5" />
                <img src="https://skillicons.dev/icons?i=css" alt="CSS3" />
                <img src="https://skillicons.dev/icons?i=js" alt="JavaScript" />
              </div>
              <p>React, HTML, CSS, JavaScript</p>
            </div>

            {/* Desarrollo Móvil */}
            <div className="skill-category">
              <h3>Desarrollo Móvil</h3>
              <div className="skills-icons">
                <img
                  src="https://skillicons.dev/icons?i=flutter"
                  alt="Flutter"
                />
                <img
                  src="https://skillicons.dev/icons?i=react"
                  alt="React Native"
                />
                <img src="https://skillicons.dev/icons?i=swift" alt="Swift" />
                <img src="https://skillicons.dev/icons?i=kotlin" alt="Kotlin" />
              </div>
              <p>Flutter, React Native, Swift (iOS), Kotlin</p>
            </div>

            {/* Bases de Datos */}
            <div className="skill-category">
              <h3>Bases de Datos</h3>
              <div className="skills-icons">
                <img src="https://skillicons.dev/icons?i=mysql" alt="MySQL" />
                <img
                  src="https://skillicons.dev/icons?i=postgresql"
                  alt="PostgreSQL"
                />
                <img
                  src="https://skillicons.dev/icons?i=mongodb"
                  alt="MongoDB"
                />
                <img src="https://skillicons.dev/icons?i=sqlite" alt="SQLite" />
              </div>
              <p>MySQL, PostgreSQL, MongoDB, SQLite</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Proyectos */}
      {/* <section id="projects" className="projects-section">
        <div className="container">
          <h2>Proyectos</h2>
          <div className="projects-grid">
            <div className="project-card">
              <h3>Proyecto 1</h3>
              <p>Descripción del proyecto...</p>
            </div>
            <div className="project-card">
              <h3>Proyecto 2</h3>
              <p>Descripción del proyecto...</p>
            </div>
            <div className="project-card">
              <h3>Proyecto 3</h3>
              <p>Descripción del proyecto...</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Sección Contacto */}
      <section id="contact" className="contact-section">
        <div className="container">
          <h2>Contacto</h2>

          {/* Estado de disponibilidad */}
          <div className="availability-badge">
            <span className="availability-indicator"></span>
            <p>Disponible para nuevos proyectos</p>
          </div>

          <p className="contact-intro">
            ¿Necesitas un desarrollador fullstack para tu próximo proyecto?
            Estoy disponible para trabajos freelance, colaboraciones y
            consultoría técnica.
          </p>

          <div className="contact-grid">
            {/* Columna izquierda: Redes profesionales */}
            <div className="contact-column">
              <h3>Redes Profesionales</h3>
              <div className="contact-links">
                <a
                  href="https://www.linkedin.com/in/no%C3%A9-alejandro-rodr%C3%ADguez-moto-a48431290/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  <i className="contact-icon linkedin"></i>
                  <span>Noé Alejandro</span>
                </a>
                <a
                  href="https://github.com/NoeOnDev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  <i className="contact-icon github"></i>
                  <span>NoeOnDev</span>
                </a>
              </div>
            </div>

            {/* Columna derecha: Contacto directo */}
            <div className="contact-column">
              <h3>Contacto Directo</h3>
              <div className="contact-links">
                <a href="mailto:alxg5516@email.com" className="contact-link">
                  <i className="contact-icon email"></i>
                  <span>alxg5516@email.com</span>
                </a>
                <a
                  href="https://wa.me/529614496689"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  <i className="contact-icon whatsapp"></i>
                  <span>+52 961 449 6689</span>
                </a>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="contact-cta">
            <p>
              ¡Contáctame para discutir cómo puedo ayudarte con tu proyecto!
            </p>
            <a
              href="https://wa.me/529614496689"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button"
            >
              Iniciar Proyecto
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
