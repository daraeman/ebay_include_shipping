// ==UserScript==
// @name		Ebay Include Shipping
// @namespace	ebay_include_shipping
// @description	Show the true total including shipping on Ebay
// @homepageURL	https://github.com/daraeman/ebay_include_shipping
// @author		daraeman
// @version		1.0.1
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
//			console.log( "el", el )
			let item_text = getItemPriceEl( el ).text().trim();
//			console.log( "item_text", item_text )
			let currency = item_text[0];
//			console.log( "currency", currency )
			let item_price = new Big( item_text.substr( 1 ) );
//			console.log( "item_price", item_price )
			let shipping_text = getShippingPriceEl( el ).text().trim().substr( 2 ).replace( "shipping", "" ).trim();	
			if ( shipping_text ) {
				let shipping_price = new Big( shipping_text );
				addSearchItemShippingPrice( el, item_price.plus( shipping_price ), currency );
			}
		});
	}

	function getItemPriceEl( parent, post_add ) {
		let selector = ( post_add ) ? ".bold:not( .ebay_include_shipping )" : ".bold";
		let this_parent = getShippingPriceParentEl( parent );
		return this_parent.find( selector );
	}

	function getShippingPriceEl( parent ) {
		return parent.find( ".lvshipping .ship .fee" );
	}

	function getShippingPriceParentEl( parent ) {
		return parent.find( ".lvprices .lvprice" );
	}

	function addSearchItemShippingPrice( el, price, currency ) {
		let price_parent_el = getShippingPriceParentEl( el );
		price_parent_el.prepend( '<span class="bold ebay_include_shipping">'+ currency + price.toFixed( 2 ).toString() +' incl. shipping</span><br>' );
		let item_price_el = getItemPriceEl( el, true );
		let shipping_price_el = getShippingPriceEl( el );
		item_price_el.text( "(" + item_price_el.text().trim() + shipping_price_el.text().trim().replace( "+", " + " ) +")" );
		item_price_el.removeClass( "bold" ).css( {
			"display": "inline-block",
			"margin-top": "4px",
			"font-size": "13px",
		});
		shipping_price_el.hide();
	}

	function init() {
		getPage();
		doPage();
	}

	init();

})( jQuery, Big );