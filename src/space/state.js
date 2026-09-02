// Mutable shared state for the space scene. Modules read/write via these
// singletons instead of file-scope globals.
export const state = {
  projects: [],
  currentView: 'projects',
  selectedStar: null,
  isAnimating: false,
  animTarget: null,
  travelTarget: null,
  cameraOrigin: null,
  targetControls: null,
  constellationFocus: null,
  focusGroup: null,
  themeIdx: 0,
};

export const registry = {
  starMeshes: [],
  glowSprites: [],
  lineMeshes: [],
  orbitLines: [],
  orbitData: [],
  shootingStars: [],
  labelObjects: [],
  constellationOrbits: [],
};
