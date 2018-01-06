// ==UserScript==
// @name		Ebay Include Shipping
// @namespace	ebay_include_shipping
// @description	Show the true total including shipping on Ebay
// @homepageURL	https://github.com/daraeman/ebay_include_shipping
// @author		daraeman
// @version		1.0
// @date		2018-01-05
// @include		/https?:\/\/www\.ebay\.com\/*/
// @require		https://code.jquery.com/jquery-3.2.1.slim.min.js
// @require		https://cdnjs.cloudflare.com/ajax/libs/big.js/5.0.3/big.min.js
// @downloadURL	https://github.com/daraeman/ebay_include_shipping/raw/master/ebay_include_shipping.user.js
// @updateURL	https://github.com/daraeman/ebay_include_shipping/raw/master/ebay_include_shipping.meta.js
// ==/UserScript==

(function( $, Big ) {

	let page;

	function getPage() {
		if ( $( "#Results" ).length )
			page = "search";
	}

	function doPage() {
		if ( page === "search" )
			doSearchPage();
	}

	function doSearchPage() {

		// hide the "previous price" thing since its not very useful and screw up the formatting
		$( ".cmpat" ).hide();

		$( "#ListViewInner .sresult" ).each( ( i, node ) => {
			let el = $( node );
			let item_text = el.find( ".lvprices .lvprice .bold" ).text().trim();
			let currency = item_text[0];
			let item_price = new Big( item_text.substr( 1 ) );
			let shipping_text = el.find( ".lvshipping .ship .fee" ).text().trim().substr( 2 ).replace( "shipping", "" ).trim();	
			if ( shipping_text ) {
				let shipping_price = new Big( shipping_text );
				addSearchItemShippingPrice( el, item_price.plus( shipping_price ), currency );
			}
		});
	}

	function addSearchItemShippingPrice( el, price, currency ) {
		let price_parent_el = el.find( ".lvprices .lvprice" );
		price_parent_el.append( '<br><span style="display: inline-block; margin-top: 4px;">'+ currency + price.toFixed( 2 ).toString() +' including shipping</span>' );
	}

	function init() {
		getPage();
		doPage();
	}

	init();

})( jQuery, Big );