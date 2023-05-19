module.exports = {
    settings: {
      "vetur.useWorkspaceDependencies": true,
      "vetur.experimental.templateInterpolationService": true
    },
    projects: [
      './', // shorthand for only root.
      {
        globalComponents: [
          './src/components/**/*.vue'
        ]
      }
    ]
  }