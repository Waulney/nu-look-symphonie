document.addEventListener("DOMContentLoaded", () => {
  // --- DONNÉES DES NIVEAUX (20 thèmes autour de la musique symphonique) ---
  const levels = [
    { name: "1. Cordes", words: ["VIOLON", "ALTO", "HARPE", "ARCHET", "Touche", "PONT"] },
    { name: "2. Bois", words: ["FLUTE", "BASSON", "HAUTBOIS", "ROSEAU", "CLIN", "CLEF"] },
    { name: "3. Cuivres", words: ["COR", "TUBA", "TROMBONE", "PAVILLON", "CUIVRE", "PISTON"] },
    { name: "4. Percussions", words: ["TIMBALE", "CYMBALE", "GONG", "TRIANGLE", "CAISSE", "PEAU"] },
    { name: "5. Claviers", words: ["PIANO", "ORGUE", "CELESTA", "TOUCHE", "PEDALE", "CORDE"] },
    { name: "6. Nuances", words: ["FORTE", "PIANO", "CRES", "DECRES", "NUANCE", "DOUX"] },
    { name: "7. Tempos rapides", words: ["PRESTO", "ALLEGRO", "VIVACE", "SPEED", "VITE", "ANIME"] },
    { name: "8. Tempos lents", words: ["ADAGIO", "ANDANTE", "LARGO", "LENTO", "CALME", "PAUSE"] },
    { name: "9. Structures", words: ["SONATE", "RONDO", "FINALE", "THEME", "MOTIF", "CODA"] },
    { name: "10. Formes", words: ["CONCERTO", "SYMPHONIE", "SUITE", "OPERA", "BALLET", "CHOEUR"] },
    { name: "11. Rôles", words: ["CHEF", "MAESTRO", "SOLISTE", "MUSICEN", "ARTISTE", "TUTTI"] },
    { name: "12. Lieux", words: ["SALLE", "SCENE", "BALCON", "FOYER", "FOSSE", "ACUSTIC"] },
    { name: "13. Compositeurs I", words: ["BACH", "MOZART", "HAYDN", "VIVALDI", "GLUCK", "LISZT"] },
    { name: "14. Compositeurs II", words: ["BRAHMS", "ARLY", "DANIEL", "WAGNER", "VERDI", "BIZET"] },
    { name: "15. Harmonie", words: ["ACCORD", "GAMME", "TON", "MODE", "TIERCE", "QUINTE"] },
    { name: "16. Expression", words: ["LEGATO", "STACCATO", "TUTTI", "SOLO", "RUBATO", "LENTO"] },
    { name: "17. Orchestre", words: ["PUPITRE", "PARTITION", "PUPITRE", "BATON", "MUTE", "TUTTI"] },
    { name: "18. Voix", words: ["SOPRANO", "ALTO", "TENOR", "BASSE", "VOIX", "CHOEUR"] },
    { name: "19. Émotions", words: ["JOIE", "DRAME", "PASSION", "CALME", "GLOIRE", "PAIX"] },
    { name: "20. Virtuoses", words: ["GENIE", "TALENT", "VIRTUOSE", "STYLE", "ART", "ETUDE"] }
  ];

  const GRID_SIZE = 10;
  let currentLevelIndex = 0;
  let grid = [];
  let foundWords = new Set();
  let isSelecting = false;
  let selectedCells = [];

  // --- ÉLÉMENTS DU DOM ---
  const gridContainer = document.getElementById("grid-container");
  const wordsListElement = document.getElementById("words-list");
  const selectLevelElement = document.getElementById("select-level");
  const themeToggleBtn = document.getElementById("theme-toggle");
  const levelTitleElement = document.getElementById("level-title");

  // --- INITIALISATION DES OPTIONS DE NIVEAUX ---
  levels.forEach((lvl, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = lvl.name;
    selectLevelElement.appendChild(option);
  });

  selectLevelElement.addEventListener("change", (e) => {
    currentLevelIndex = parseInt(e.target.value, 10);
    loadLevel(currentLevelIndex);
  });

  // --- MODE CLAIR / SOMBRE ---
  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });

  // --- CHARGEMENT D'UN NIVEAU ---
  function loadLevel(index) {
    foundWords.clear();
    gridContainer.innerHTML = "";
    wordsListElement.innerHTML = "";
    
    const currentLevel = levels[index];
    levelTitleElement.textContent = `NU LOOK SYMPHONIE - ${currentLevel.name.split(". ")[1] || ""}`;

    // Normaliser les mots (majuscules, sans accents)
    const wordsToPlace = currentLevel.words.map(w => 
      w.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    );

    // Initialiser la grille vide (10x10)
    grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(""));

    // Placer les mots dans la grille
    wordsToPlace.forEach(word => placeWordInGrid(word));

    // Remplir les cases vides avec des lettres aléatoires
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (grid[r][c] === "") {
          grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
      }
    }

    // Afficher la grille dans le DOM
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.textContent = grid[r][c];
        gridContainer.appendChild(cell);
      }
    }

    // Afficher la liste des mots à trouver
    wordsToPlace.forEach(word => {
      const li = document.createElement("li");
      li.textContent = word;
      li.id = `word-${word}`;
      wordsListElement.appendChild(li);
    });
  }

  // --- ALGORITHME DE PLACEMENT (8 directions) ---
  function placeWordInGrid(word) {
    const directions = [
      [0, 1],   // Droite
      [1, 0],   // Bas
      [1, 1],   // Diagonale bas-droite
      [-1, 1],  // Diagonale haut-droite
      [0, -1],  // Gauche
      [-1, 0],  // Haut
      [-1, -1], // Diagonale haut-gauche
      [1, -1]   // Diagonale bas-gauche
    ];

    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 100) {
      attempts++;
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const startRow = Math.floor(Math.random() * GRID_SIZE);
      const startCol = Math.floor(Math.random() * GRID_SIZE);

      const endRow = startRow + dir[0] * (word.length - 1);
      const endCol = startCol + dir[1] * (word.length - 1);

      if (endRow >= 0 && endRow < GRID_SIZE && endCol >= 0 && endCol < GRID_SIZE) {
        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          const r = startRow + dir[0] * i;
          const c = startCol + dir[1] * i;
          if (grid[r][c] !== "" && grid[r][c] !== word[i]) {
            canPlace = false;
            break;
          }
        }

        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            const r = startRow + dir[0] * i;
            const c = startCol + dir[1] * i;
            grid[r][c] = word[i];
          }
          placed = true;
        }
      }
    }
  }

  // --- GESTION DE LA SÉLECTION (Souris / Tactile) ---
  function getCellFromPoint(x, y) {
    const element = document.elementFromPoint(x, y);
    return element && element.classList.contains("cell") ? element : null;
  }

  function startSelection(cell) {
    if (!cell) return;
    isSelecting = true;
    selectedCells = [cell];
    cell.classList.add("selected");
  }

  function moveSelection(cell) {
    if (!isSelecting || !cell) return;
    const startCell = selectedCells[0];
    const r1 = parseInt(startCell.dataset.row, 10);
    const c1 = parseInt(startCell.dataset.col, 10);
    const r2 = parseInt(cell.dataset.row, 10);
    const c2 = parseInt(cell.dataset.col, 10);

    const dr = r2 - r1;
    const dc = c2 - c1;

    // Vérifier si le mouvement est aligné (horizontal, vertical ou diagonal)
    if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) {
      const steps = Math.max(Math.abs(dr), Math.abs(dc));
      const stepR = dr === 0 ? 0 : dr / steps;
      const stepC = dc === 0 ? 0 : dc / steps;

      // Nettoyer la sélection précédente
      document.querySelectorAll(".cell.selected").forEach(c => c.classList.remove("selected"));
      selectedCells = [];

      for (let i = 0; i <= steps; i++) {
        const currR = r1 + stepR * i;
        const currC = c1 + stepC * i;
        const targetCell = gridContainer.querySelector(`[data-row="${currR}"][data-col="${currC}"]`);
        if (targetCell) {
          targetCell.classList.add("selected");
          selectedCells.push(targetCell);
        }
      }
    }
  }

  function endSelection() {
    if (!isSelecting) return;
    isSelecting = false;

    const selectedWord = selectedCells.map(c => c.textContent).join("");
    const reversedWord = selectedWord.split("").reverse().join("");

    const currentLevelWords = levels[currentLevelIndex].words.map(w =>
      w.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    );

    let match = null;
    if (currentLevelWords.includes(selectedWord)) {
      match = selectedWord;
    } else if (currentLevelWords.includes(reversedWord)) {
      match = reversedWord;
    }

    if (match && !foundWords.has(match)) {
      foundWords.add(match);
      selectedCells.forEach(c => {
        c.classList.remove("selected");
        c.classList.add("found");
      });
      const listItem = document.getElementById(`word-${match}`);
      if (listItem) listItem.classList.add("found-word");

      // Vérifier si tout le niveau est terminé
      if (foundWords.size === currentLevelWords.length) {
        setTimeout(() => {
          alert("Bravo ! Vous avez trouvé tous les mots de ce niveau !");
        }, 200);
      }
    } else {
      selectedCells.forEach(c => c.classList.remove("selected"));
    }
    selectedCells = [];
  }

  // Événements Souris
  gridContainer.addEventListener("mousedown", (e) => {
    const cell = getCellFromPoint(e.clientX, e.clientY);
    startSelection(cell);
  });

  gridContainer.addEventListener("mousemove", (e) => {
    const cell = getCellFromPoint(e.clientX, e.clientY);
    moveSelection(cell);
  });

  document.addEventListener("mouseup", endSelection);

  // Événements Tactiles (Mobile)
  gridContainer.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    const cell = getCellFromPoint(touch.clientX, touch.clientY);
    startSelection(cell);
  }, { passive: true });

  gridContainer.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    const cell = getCellFromPoint(touch.clientX, touch.clientY);
    moveSelection(cell);
  }, { passive: true });

  document.addEventListener("touchend", endSelection);

  // Lancer le premier niveau
  loadLevel(currentLevelIndex);
});