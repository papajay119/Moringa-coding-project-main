// Example products for this course project.
// Names and KSh prices come from the public Otaku Vault Kenya listing (otakuvault.co.ke).
// They are practice data only: nothing here is for sale.
export const webProducts = [
  { title: 'Monkey D. Luffy Sitting Collectible Figure', detail: 'One Piece figurine', category: 'figurines', price: 'KSh 1,199', oldPrice: 'KSh 1,799', image: 'images/luffy-figure.jpeg' },
  { title: 'Son Goku Ultra Instinct Collectible Figure', detail: 'Dragon Ball figurine', category: 'figurines', price: 'KSh 1,999', oldPrice: 'KSh 2,899', image: 'images/goku-figure.jpeg' },
  { title: 'Ryomen Sukuna Chibi Collectible Figure', detail: 'Jujutsu Kaisen figurine', category: 'figurines', price: 'KSh 1,299', oldPrice: 'KSh 2,499', image: 'images/sukuna-figure.jpeg' },
  { title: 'Muichiro Tokito Figurine', detail: 'Demon Slayer figurine', category: 'figurines', price: 'KSh 799', oldPrice: 'KSh 1,199', image: 'images/tokito-figure.jpeg' },
  { title: 'Anime Sticker Pack, 50 PCS Waterproof Vinyl', detail: 'Attack on Titan stickers', category: 'stickers', price: 'KSh 399', oldPrice: 'KSh 699', image: 'images/aot-stickers.jpeg' },
  { title: 'Kid Goku Chibi Keychain, Flying Nimbus Edition', detail: 'Dragon Ball keychain', category: 'keychains', price: 'KSh 399', oldPrice: 'KSh 799', image: 'images/kid-goku-keychain.jpeg' },
  { title: 'Colossal Titan PVC Keychain', detail: 'Attack on Titan keychain', category: 'keychains', price: 'KSh 399', oldPrice: 'KSh 799', image: 'images/colossal-titan-keychain.jpeg' },
  { title: 'Armoured Titan Edition T-Shirt', detail: 'Attack on Titan t-shirt', category: 'tshirts', price: 'KSh 1,499', image: 'images/armoured-titan-tshirt.jpeg' },
  { title: 'Kyojuro Rengoku Flame Hashira T-Shirt', detail: 'Demon Slayer t-shirt', category: 'tshirts', price: 'KSh 1,499', image: 'images/rengoku-tshirt.jpeg' }
].map(item => ({ ...item, fromWeb: true }))