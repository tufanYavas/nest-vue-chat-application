/* eslint-disable @typescript-eslint/no-unused-vars */
jQuery(function (_0x50870c) {
	'use strict';
	if (localStorage.getItem('banned') != null) {
		swal(
			'Dikkat',
			'Banlandığınız için giriş yapmanız mümkün olmayacaktır.',
			'error',
		);
	}
	var _0x49ba45 = _0x50870c('#content').offset().top;
	_0x50870c(window).on('scroll', function () {
		stop = Math.round(_0x50870c(window).scrollTop());
		if (stop > _0x49ba45) {
			_0x50870c('.navbar').addClass('past-main');
			_0x50870c('.navbar').addClass('effect-main');
		} else {
			_0x50870c('.navbar').removeClass('past-main');
		}
	});
	_0x50870c(document).on(
		'click.nav',
		'.navbar-collapse.in',
		function (_0x54988a) {
			if (_0x50870c(_0x54988a.target).is('a')) {
				_0x50870c(this).removeClass('in').addClass('collapse');
			}
		},
	);
	_0x50870c(window).on('scroll', function () {
		if (_0x50870c(this).scrollTop() > 800) {
			_0x50870c('#back-top').fadeIn();
		} else {
			_0x50870c('#back-top').fadeOut();
		}
	});
	_0x50870c('#back-top').on('click', function () {
		_0x50870c('#back-top').tooltip('hide');
		_0x50870c('body,html').animate(
			{
				scrollTop: 0,
			},
			1500,
		);
		return false;
	});
	_0x50870c('.review-cards').owlCarousel({
		slideSpeed: 200,
		items: 1,
		singleItem: true,
		autoplay: true,
		autoplayTimeout: 2000,
		autoplayHoverPause: true,
		pagination: false,
	});
	_0x50870c('.clients').owlCarousel({
		slideSpeed: 200,
		autoPlay: true,
		pagination: false,
		dots: false,
		responsiveClass: true,
		responsive: {
			0: {
				items: 2,
			},
			320: {
				items: 3,
			},
			600: {
				items: 4,
				nav: false,
			},
			1000: {
				items: 5,
				loop: false,
			},
		},
	});
	_0x50870c('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(
		function () {
			if (
				location.pathname.replace(/^\//, '') ==
				this.pathname.replace(/^\//, '') &&
				location.hostname == this.hostname
			) {
				var _0x5efd07 = _0x50870c(this.hash);
				_0x5efd07 = _0x5efd07.length
					? _0x5efd07
					: _0x50870c('[name=' + this.hash.slice(1) + ']');
				if (_0x5efd07.length) {
					_0x50870c('html, body').animate(
						{
							scrollTop: _0x5efd07.offset().top - 54,
						},
						1000,
						'easeInOutExpo',
					);
					return false;
				}
			}
		},
	);
	_0x50870c('.js-scroll-trigger').on('click', function () {
		_0x50870c('.navbar-collapse').collapse('hide');
	});
	_0x50870c('body').scrollspy({
		target: '#mainNav',
		offset: 54,
	});
	new WOW().init();
	_0x50870c('.counter').counterUp({
		delay: 10,
		time: 1000,
	});
	_0x50870c(window).on('load', function () {
		setTimeout(function () {
			_0x50870c('#loading').fadeOut('slow', function () { });
		}, 1000);
	});
	_0x50870c(document).ready(function () {
		_0x50870c('#chimp-form').validate({
			submitHandler: function (_0x260aa7) {
				_0x50870c.post(
					'assets/php/subscribe.php',
					{
						email: _0x50870c('#chimp-email').val(),
					},
					function (_0x4a7e44) {
						_0x50870c('#response').html(_0x4a7e44);
					},
				);
			},
			rules: {
				email: {
					required: true,
					email: true,
				},
			},
		});
	});
	_0x50870c('.popup').magnificPopup({
		disableOn: 0,
		type: 'iframe',
		mainClass: 'mfp-fade',
		removalDelay: 160,
		preloader: false,
		fixedContentPos: false,
	});
});

function showLogin() {
	if (!$('.front').is(':visible')) {
		$('.back').hide();
		$('.front').show();
		$('.intro-block a').text('Giriş Yap');
	} else {
		$('.front').hide();
		$('.back').show();
		$('.intro-block a').text('Üye Ol');
	}
}

function showRegister() {
	if (!$('.back').is(':visible')) {
		$('.front').hide();
		$('.back').show();
	}
}

function login() {
	if (localStorage.getItem('banned') != null) {
		return false;
	}
	$('.back button').each(function () {
		$(this).attr('disabled', true);
	});
	var _0x4121a3 = $('#username').val().trim();
	var _0x416ccb = $('#password').val();
	var rumuz = $('#rumuz').val().trim();
	var gender = $('input[name=gender2]:checked').val();

	if (_0x4121a3.length == 0) {
		swal('Uyarı', 'Kullanıcı adınızı girmediniz.', 'warning');
		return;
	}
	if (_0x4121a3.length < 3) {
		swal(
			'Uyarı',
			'Kullanıcı adı en az 3 karakter olmak zorundadır.',
			'warning',
		);
		return;
	}
	if (_0x4121a3.length > 18) {
		swal('Uyarı', 'Kullanıcı adı en fazla 18 karakterdir.', 'warning');
		return;
	}
	if (_0x416ccb.length < 6) {
		swal(
			'Şifre hatalı',
			'Şifreler en az 6 karakterden oluşmaktadır.',
			'info',
		);
		$('.back button').attr('disabled', false);
		return false;
	}
	$.ajax({
		type: 'POST',
		url: '/login',
		data:
			'username=' +
			_0x4121a3 +
			'&pword=' +
			_0x416ccb +
			'&rumuz=' +
			rumuz +
			'&gender=' +
			gender,
		success: function (_0xbe3304) {
			if (_0xbe3304 == 1) {
				swal(
					'Giriş başarılı',
					"Chat'e yönlendiriliyorsunuz...",
					'success',
				);
				setTimeout(function () {
					window.location = '/chat/';
				}, 1200);
			} else {
				var _0x502a51 = _0xbe3304.split('%');
				$('.back button').each(function () {
					$(this).attr('disabled', false);
				});
				swal('Giriş hatalı', _0x502a51[1], 'error');
			}
		},
	});
}

function register() {
	if (localStorage.getItem('banned') != null) {
		return false;
	}
	$('.front button').attr('disabled', true);
	var _0x39c318 = $('#regusername').val();
	var _0x523bd5 = $('#regpword').val();
	var _0x53af3a = $('#regpword2').val();
	var _0x29e762 = $('input[name=gender]:checked').val();
	if (typeof _0x29e762 == 'undefined') {
		$('.front button').attr('disabled', false);
		swal('Bilgi', 'Lütfen cinsiyetinizi seçiniz.', 'info');
		return false;
	}
	if (_0x39c318.length == 0) {
		$('.front button').attr('disabled', false);
		swal('Bilgi', 'Kullanıcı adınızı girmediniz.', 'info');
		return false;
	}
	if (_0x523bd5.length < 6) {
		swal(
			'Şifre hatalı',
			'Şifreler en az 6 karakterden oluşmaktadır.',
			'info',
		);
		$('.front button').attr('disabled', false);
		return false;
	} else if (_0x523bd5 != _0x53af3a) {
		swal(
			'Şifreler uyuşmuyor',
			'Lütfen her iki şifre alanına aynı şifreyi girdiğinizden emin olun.',
			'error',
		);
		$('.front button').attr('disabled', false);
		return false;
	}
	$.ajax({
		type: 'POST',
		url: '/register',
		data:
			'username=' +
			_0x39c318 +
			'&pword=' +
			_0x523bd5 +
			'&gender=' +
			_0x29e762,
		success: function (_0x113a8c) {
			if (_0x113a8c == 1) {
				swal(
					'Kayıt başarılı',
					'Giriş yapıp sohbete başlayabilirsiniz.',
					'success',
				);
				$('.front button').attr('disabled', false);
				$('#regusername,#regpword,#regpword2').val('');
				showLogin();
			} else {
				$('.front button').each(function () {
					$(this).attr('disabled', false);
				});
				var _0x17573b = _0x113a8c.split('%');
				swal('Kayıt hatalı', _0x17573b[1], 'error');
			}
		},
	});
}
var askPass = 0;

function validateUser() {
	if (askPass == 0) {
		var username = $('#username').val().trim();
		if (username.length == 0) {
			swal('Uyarı', 'Kullanıcı adınızı girmediniz.', 'warning');
			return;
		}
		if (username.length < 3) {
			swal(
				'Uyarı',
				'Kullanıcı adı en az 3 karakter olmak zorundadır.',
				'warning',
			);
			return;
		}
		if (username.length > 18) {
			swal('Uyarı', 'Kullanıcı adı en fazla 18 karakterdir.', 'warning');
			return;
		}
		$.ajax({
			url: '/userValidate',
			type: 'POST',
			data: 'username=' + username,
			success: function (_0x5b5683) {
				if (_0x5b5683 == 1) {
					askPassword();
				} else if (_0x5b5683 == 2) {
					askPassword();
					askRumuz();
				} else {
					visitorLogin();
				}
			},
			error: function () {
				alert('Hata!');
			},
		});
	} else {
		login();
	}
}

function askPassword() {
	$('#password').show();
	$('.cinsiyet-alani').hide();
	askPass = 1;
}

function askRumuz() {
	$('#rumuz').show();
}

function visitorLogin() {
	if (localStorage.getItem('banned') != null) {
		return false;
	}
	$('.back button').each(function () {
		$(this).attr('disabled', true);
	});
	var _0x352746 = $('#username').val();
	var _0x5506c3 = $('input[name=gender2]:checked').val();
	if (typeof _0x5506c3 == 'undefined') {
		$('.back button').each(function () {
			$(this).attr('disabled', false);
		});
		swal('Bilgi', 'Lütfen cinsiyetinizi seçiniz.', 'info');
		return false;
	}
	if (_0x352746.length == 0) {
		$('.back button').each(function () {
			$(this).attr('disabled', false);
		});
		swal('Bilgi', 'Kullanıcı adınızı girmediniz.', 'info');
		return false;
	}
	$.ajax({
		type: 'POST',
		url: '/new-visitor',
		data: 'username=' + _0x352746 + '&gender=' + _0x5506c3,
		success: function (_0x26ae3b) {
			if (_0x26ae3b == 1) {
				swal(
					'Giriş başarılı',
					"Chat'e yönlendiriliyorsunuz...",
					'success',
				);
				setTimeout(function () {
					window.location = '/chat/';
				}, 1200);
			} else {
				var _0x13a301 = _0x26ae3b.split('%');
				swal('Giriş hatalı', _0x13a301[1], 'error');
				$('.back button').each(function () {
					$(this).attr('disabled', false);
				});
			}
		},
	});
}
