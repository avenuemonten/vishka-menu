$(function() {

	var totalItemsCount = 0;

	function updateCartData() {
		$('.cart-items').html('');
		var totalCount = 0;
		var totalSum = 0;
		var cartItems = localStorage.getItem('cartItems');

		var cartItemsCount = JSON.parse(localStorage.getItem("cartItems"));
		totalItemsCount = cartItemsCount.reduce(function(total, item) {
			return total + item.count;
		}, 0);

		if (totalItemsCount > 0) {
			var parsedCartItems = JSON.parse(cartItems);
			parsedCartItems.forEach(function(item) {
				$('.cart-items').append('\
					<div class="cart-item">\
						<div class="cart-image"><img src="'+item.image+'"></div>\
						<div class="cart-data">\
							<div class="cart-title"><span>'+item.name+'</span> <span>'+item.price+' ₽</span></div>\
							<div class="cart-footer">\
								<div class="cart-weight">'+item.weight+'</div>\
								<div class="cart-counter">\
									<div class="cart-count-minus" data-id="'+item.id+'">-</div>\
									<div class="cart-count-number">'+item.count+'</div>\
									<div class="cart-count-plus" data-id="'+item.id+'">+</div>\
								</div>\
							</div>\
						</div>\
					</div>\
				');
				totalCount += item.count || 0;
				totalSum += item.price*item.count || 0;
			});
			$('.cart-items').append('\
				<div class="cart-item cart-item-total">\
					<div class="cart-data">\
						<div class="cart-title"><span>Итого:</span> <span>'+totalSum+' ₽</span></div>\
					</div>\
				</div>\
			');
			$('.cart-button .cart-count').html(totalCount);
		} else {
			$('.cart-button .cart-count').html('0');
			$('.cart').removeClass('show');
		}
	}

	function updateCartItem(itemId, change) {
		var cartItems = JSON.parse(localStorage.getItem("cartItems"));
		for (var i = 0; i < cartItems.length; i++) {
			if (cartItems[i].id === itemId) {
				cartItems[i].count += change;
				if (cartItems[i].count < 1) {
					cartItems.splice(i, 1);
				}
				break;
			}
		}
		localStorage.setItem('cartItems', JSON.stringify(cartItems));
		updateCartData();
	}

	$('.cart-button').on('click', function() {
		if (totalItemsCount > 0) {
			$('.cart').toggleClass('show');
		}
	});

	$('.cart-shadow').on('click', function() {
		$('.cart').removeClass('show');
	});

	$('.product-button').on('click', function() {
		var originalButton = $(this);
		var originalButtonPosition = originalButton.offset();
		var cloneButton = originalButton.clone().appendTo('#clonesContainer');
		cloneButton.css({
			position: 'absolute',
			top: originalButtonPosition.top,
			left: originalButtonPosition.left-30
		});
		cloneButton.animate({
			top: '-=300px',
			right: '+=200px',
			opacity: 0
		}, {
			duration: 1000,
			easing: 'swing',
			step: function(now, fx) {
				if (fx.prop === 'top') {
					var scale = 1 - now/200000;
					cloneButton.css('transform', 'scale(' + scale + ')');
				}
			},
			complete: function() {
				$(this).remove();
			}
		});

		var buttonData = $(this).data();

		if (localStorage.getItem('cartItems')) {
			var cartItems = JSON.parse(localStorage.getItem('cartItems'));
			var existingItem = cartItems.find(function(item) {
				return item.id == buttonData.id;
			});

			if (existingItem) {
				existingItem.count++;
			} else {
				buttonData.count = 1;
				cartItems.push(buttonData);
			}

			localStorage.setItem('cartItems', JSON.stringify(cartItems));
		} else {
			var cartItems = [buttonData];
			localStorage.setItem('cartItems', JSON.stringify(cartItems));
		}
		updateCartData();
	});

	$(document).on('click', '.cart-count-minus', function() {
		updateCartItem($(this).data('id'), -1);
	});

	$(document).on('click', '.cart-count-plus', function() {
		updateCartItem($(this).data('id'), 1);
	});

	if (!localStorage.getItem('cartItems')) {
		localStorage.setItem('cartItems', JSON.stringify([]));
	}
	updateCartData();

	$('.cart-body h2 span').on('click', function() {
		$('.cart').removeClass('show');
	});

});