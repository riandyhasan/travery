export const imageSource = (name: string) => {
    switch (name) {
      case 'header':
        return require('@src/assets/images/header.webp');
      case 'profile':
        return require('@src/assets/images/profile.webp');
      default:
        return undefined;
    }
  };
  