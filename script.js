(() => {
  const projectGrid = document.querySelector("#projects .projects");
  if (!projectGrid) {
    throw new Error("The selected concepts gallery could not be found.");
  }

  const concepts = [
    ["concept-01.jpg", "Dark architectural portfolio website concept"],
    ["concept-02.jpg", "Warm coffee shop landing page concept"],
    ["concept-03.jpg", "Blue AI and strategy consulting website concept"],
    ["concept-04.jpg", "Dark Tokyo travel website concept"],
    ["concept-05.jpg", "Minimal mindfulness app landing page concept"],
    ["concept-06.jpg", "Minimal monochrome fashion store website concept"],
    ["concept-07.jpg", "Portrait photo reference"],
    ["concept-08.jpg", "Bright colorful creative studio portfolio concept"],
    ["concept-09.jpg", "Dark artisan bakery website concept"],
  ];

  const gallery = document.createElement("div");
  projectGrid.classList.add("concept-gallery-grid");
  gallery.className = "concept-gallery";
  gallery.setAttribute("role", "group");
  gallery.setAttribute("aria-label", "Visual inspiration gallery");
  Object.assign(gallery.style, {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    aspectRatio: "16 / 9",
    overflow: "hidden",
    borderRadius: "12px",
    background: "#efefef",
  });

  const rows = [];
  for (let rowIndex = 0; rowIndex < 3; rowIndex += 1) {
    const row = document.createElement("div");
    Object.assign(row.style, {
      display: "flex",
      flex: "1 1 0",
      gap: "6px",
      minHeight: "0",
    });

    for (const [filename, description] of concepts.slice(rowIndex * 3, rowIndex * 3 + 3)) {
      const figure = document.createElement("figure");
      Object.assign(figure.style, {
        display: "grid",
        placeItems: "center",
        minWidth: "0",
        minHeight: "0",
        margin: "0",
        overflow: "hidden",
        flex: "1 1 0",
        transformOrigin: "center",
        background: "#f5f5f5",
      });

      const image = document.createElement("img");
      image.src = `concept-images/${filename}`;
      image.alt = description;
      Object.assign(image.style, {
        display: "block",
        width: "100%",
        height: "100%",
        objectFit: "contain",
      });

      figure.append(image);
      row.append(figure);
    }

    gallery.append(row);
    rows.push(row);
  }
  projectGrid.replaceChildren(gallery);

  const smallScreen = window.matchMedia("(max-width: 480px)");
  const updateGalleryLayout = () => {
    if (smallScreen.matches) {
      gallery.style.aspectRatio = "auto";
      gallery.style.gap = "4px";
      for (const row of rows) {
        Object.assign(row.style, {
          flex: "none",
          flexWrap: "wrap",
          gap: "4px",
        });
        for (const figure of row.children) {
          figure.style.aspectRatio = "1.15";
            figure.style.flex = "1 1 calc(50% - 4px)";
          }
        }
    } else {
      gallery.style.aspectRatio = "16 / 9";
      gallery.style.gap = "6px";
      for (const row of rows) {
        Object.assign(row.style, {
          flex: "1 1 0",
          flexWrap: "nowrap",
          gap: "6px",
        });
        for (const figure of row.children) {
          figure.style.aspectRatio = "";
          figure.style.flex = "1 1 0";
        }
      }
    }
  };
  updateGalleryLayout();
  smallScreen.addEventListener("change", updateGalleryLayout);
  window.addEventListener("resize", updateGalleryLayout);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const photoAnimations = new WeakMap();
  for (const row of rows) {
    for (const figure of row.children) {
      figure.addEventListener("pointerenter", () => {
        if (reducedMotion.matches) return;
        for (const sibling of row.children) {
          photoAnimations.get(sibling)?.cancel();
          const parsedGrow = Number.parseFloat(getComputedStyle(sibling).flexGrow);
          const currentGrow = Number.isFinite(parsedGrow) ? parsedGrow : 1;
          const currentBasis = getComputedStyle(sibling).flexBasis;
          const targetGrow = sibling === figure ? 1.1 : 0.95;
          const targetBasis = smallScreen.matches ? "calc(50% - 4px)" : "0px";
          const animation = sibling.animate(
            [
              { flexGrow: currentGrow, flexBasis: currentBasis, transform: "scale(1)" },
              {
                flexGrow: targetGrow,
                flexBasis: targetBasis,
                transform: sibling === figure ? "scale(1.01)" : "scale(.995)",
              },
            ],
            { duration: 360, easing: "cubic-bezier(.2, .75, .25, 1)", fill: "forwards" },
          );
          photoAnimations.set(sibling, animation);
        }
      });

      figure.addEventListener("pointerleave", () => {
        for (const sibling of row.children) {
          const animation = photoAnimations.get(sibling);
          if (!animation) continue;
          const parsedGrow = Number.parseFloat(getComputedStyle(sibling).flexGrow);
          const currentGrow = Number.isFinite(parsedGrow) ? parsedGrow : 1;
          const currentBasis = getComputedStyle(sibling).flexBasis;
          const currentTransform = getComputedStyle(sibling).transform;
          animation.cancel();
          const reset = sibling.animate(
            [
              { flexGrow: currentGrow, flexBasis: currentBasis, transform: currentTransform },
              {
                flexGrow: 1,
                flexBasis: smallScreen.matches ? "calc(50% - 4px)" : "0px",
                transform: "scale(1)",
              },
            ],
            { duration: 260, easing: "ease-out", fill: "forwards" },
          );
          photoAnimations.set(sibling, reset);
          reset.onfinish = () => {
            if (photoAnimations.get(sibling) !== reset) return;
            sibling.style.flexGrow = "1";
            sibling.style.transform = "";
            photoAnimations.delete(sibling);
            reset.cancel();
          };
        }
      });
    }
  }

  const interactiveButtons = document.querySelectorAll(
    "a.nav-button, a.pill-link, a.contact-link, a.text-link, .social-row a, button:not(.service-tag), #services summary",
  );
  const buttonAnimations = new WeakMap();
  for (const button of interactiveButtons) {
    button.addEventListener("pointerenter", () => {
      buttonAnimations.get(button)?.cancel();
      const baseTransform = getComputedStyle(button).transform;
      const isContactButton = button.matches(".contact-link");
      const hoverBackground = isContactButton ? "#ffffff" : "#e83c32";
      const hoverForeground = isContactButton ? "#111111" : "#ffffff";
      const animation = button.animate(
        [
          { transform: baseTransform === "none" ? "scale(1)" : baseTransform, backgroundColor: getComputedStyle(button).backgroundColor, color: getComputedStyle(button).color },
          { transform: `${baseTransform === "none" ? "" : `${baseTransform} `}scale(1.07)`, backgroundColor: hoverBackground, color: hoverForeground },
        ],
        { duration: reducedMotion.matches ? 1 : 180, easing: "ease-out", fill: "forwards" },
      );
      buttonAnimations.set(button, animation);
    });

    button.addEventListener("pointerleave", () => {
      const animation = buttonAnimations.get(button);
      if (!animation) return;
      animation.reverse();
      animation.onfinish = () => {
        if (buttonAnimations.get(button) !== animation) return;
        buttonAnimations.delete(button);
        animation.cancel();
      };
    });
  }

  for (const tag of document.querySelectorAll("#services .service-tag")) {
    let animation;
    const expand = () => {
      animation?.cancel();
      animation = tag.animate(
        [
          { transform: "scale(1)", backgroundColor: "transparent", color: "#e2e2e2" },
          { transform: "scale(1)", backgroundColor: "#e83c32", color: "#ffffff" },
        ],
        { duration: reducedMotion.matches ? 1 : 180, easing: "ease-out", fill: "forwards" },
      );
    };
    const reset = () => {
      if (!animation) return;
      animation.reverse();
      animation.onfinish = () => {
        animation?.cancel();
        animation = undefined;
      };
    };

    tag.addEventListener("pointerenter", expand);
    tag.addEventListener("pointerleave", reset);
    tag.addEventListener("focus", expand);
    tag.addEventListener("blur", reset);
  }

  const serviceStates = new WeakMap();
  const serviceAnimations = new WeakMap();
  for (const service of document.querySelectorAll("#services details.service")) {
    const summary = service.querySelector("summary");
    const body = service.querySelector(".service-body");
    if (!summary || !body) {
      throw new Error("An exploration panel is missing its summary or content.");
    }

    serviceStates.set(service, service.open);
    body.style.display = service.open ? "grid" : "none";
    summary.addEventListener("click", (event) => {
      event.preventDefault();

      const shouldOpen = !serviceStates.get(service);
      serviceStates.set(service, shouldOpen);

      const isExpanded = service.open;
      const currentHeight = isExpanded ? body.getBoundingClientRect().height : 0;
      const currentOpacity = Number.parseFloat(getComputedStyle(body).opacity);
      const startOpacity = isExpanded && Number.isFinite(currentOpacity) ? currentOpacity : 0;
      const previousAnimation = serviceAnimations.get(service);
      if (previousAnimation) window.cancelAnimationFrame(previousAnimation.frame);

      if (shouldOpen) {
        service.open = true;
        body.style.display = "grid";
      }
      body.style.overflow = "hidden";
      body.style.height = `${currentHeight}px`;
      body.style.opacity = `${startOpacity}`;

      const targetHeight = shouldOpen ? body.scrollHeight : 0;
      const endOpacity = shouldOpen ? 1 : 0;
      const startedAt = performance.now();
      const duration = reducedMotion.matches ? 1 : shouldOpen ? 320 : 220;
      const animation = { frame: 0 };
      const finish = () => {
        if (serviceAnimations.get(service) !== animation) return;
        if (shouldOpen) {
          body.style.height = "auto";
        } else {
          service.open = false;
          body.style.height = "";
          body.style.display = "none";
        }
        body.style.overflow = "";
        body.style.opacity = "";
        serviceAnimations.delete(service);
      };

      const step = () => {
        if (serviceAnimations.get(service) !== animation) return;
        const progress = Math.min((performance.now() - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const height = currentHeight + (targetHeight - currentHeight) * eased;
        const opacity = startOpacity + (endOpacity - startOpacity) * eased;
        body.style.height = `${height}px`;
        body.style.opacity = `${opacity}`;

        if (progress === 1) {
          finish();
          return;
        }
        animation.frame = window.requestAnimationFrame(step);
      };

      serviceAnimations.set(service, animation);
      animation.frame = window.requestAnimationFrame(step);
    });
  }
})();