export const imageSource = (name: string) => {
    switch (name) {
      case 'header':
        return require('@src/assets/images/header.webp');
      case 'profile':
        return require('@src/assets/images/profile.webp');
      case 'city':
        return require('@src/assets/images/city.webp');
      case 'city2':
        return require('@src/assets/images/city2.webp');
      default:
        return undefined;
    }
  };
  