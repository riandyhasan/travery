export const imageSource = (name: string) => {
  switch (name) {
    case 'header':
      return require('@src/assets/images/header.webp');
    case 'profile':
      return require('@src/assets/images/profile.webp');
    case 'avatar':
      return require('@src/assets/images/default-avatar.png');
    case 'search':
      return require('@src/assets/images/search-bg.png');
    case 'waving-hand':
      return require('@src/assets/images/waving-hand.png');
    case 'category-beach':
      return require('@src/assets/images/category/beach.png');
    case 'category-city':
      return require('@src/assets/images/category/city.png');
    case 'category-nature':
      return require('@src/assets/images/category/nature.png');
    case 'category-others':
      return require('@src/assets/images/category/others.png');
    default:
      return undefined;
  }
};
