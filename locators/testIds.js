/**
 * Central test-id constants to keep selectors readable & maintainable.
 * Using the provided Home HTML + Favourite Apps section.
 */
module.exports = {
  nav: {
    // Left rail indices (from screenshot)
    search:   'main-menu-item-0',
    home:     'main-menu-item-1',
    tvGuide:  'main-menu-item-2',
    channels: 'main-menu-item-3',
    gaming:   'main-menu-item-4',
    free:     'main-menu-item-5',
    apps:     'main-menu-item-6',
  },
  home: {
    // Favourite Apps row & tiles
    favouritesRow: 'favourite-apps',           // <div data-testid="favourite-apps" role="list">
    appTile:       'listitem',                 // role=listitem inside the row
    appTileByNamePrefix: '',                   // not used for this DOM
    contextMenu:   'app-context-menu',         // unknown => POM will also use role=menu as fallback
    menuItemDelete:'menu-item-delete',         // unknown => POM will also use role/name "Delete" as fallback
    confirmDelete: 'confirm-delete',           // unknown => fallback to role=button[name=/confirm/i]
  },
  apps: {
    featuredList: 'list-item-app_list-0',
    page: 'apps-page',                         // may not exist; POM has fallbacks
    appTile: 'app-tile',
    appTileByNamePrefix: 'app-tile-',
  },
  appDetails: {
    page: 'app-details-page',
    title: 'app-details-title',
    addToFavouritesBtn: 'app-fav-button',   // per screenshot: <button id="app-fav-button">Add to Favourites</button>
    openButton: 'app-open-button',          // per screenshot: <button id="app-open-button">...</button>
    addedBadge: 'badge-added-to-favourites',
  },
  search: {
    page: 'search-page',
    categoryTile: 'search-category-tile',
    categoryByNamePrefix: 'category-',
    resultsHeader: 'category-header',
  },
  channels: {
    page: 'channels-page',
    list: 'channels-list',
    item: 'channel-item',
  },
  common: {
    toast: 'toast',
    dialog: 'dialog',
    backBtn: 'btn-back'
  }
};