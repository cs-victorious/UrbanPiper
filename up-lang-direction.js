<script>
const redirectRules = {
    'uk': { prefix: '/uk', exceptions: ['about-us', 'contact-us', 'customer-stories'] },
    'us': { prefix: '/us', exceptions: ['about-us', 'contact-us', 'customer-stories'] },
    'au': { prefix: '/au' },
    'ca': { prefix: '/ca', defaultPage: '/hub' },
    'in': { prefix: '', defaultPage: '', showPrime: true },
    'fr': { prefix: '/fr' },
    'es': { prefix: '/es', defaultPage: '/e-commerce' },
    'es-main': { prefix: '/es' },
    'ar': { prefix: '/en-sa', exceptions: ['about-us', 'contact-us', 'customer-stories'], removeNav: true },
    'ar-sa': { prefix: '/ar-sa', exceptions: ['about-us', 'contact-us'], removeNav: true },
    'ae': { prefix: '/en-ae', exceptions: ['about-us', 'contact-us', 'customer-stories'] },
    'ar-ae': { prefix: '/ar-ae', exceptions: ['about-us', 'contact-us', 'customer-stories'] },
    'kw': { prefix: '/en-kw', exceptions: ['about-us', 'contact-us', 'customer-stories'], removeNav: true },
    'ar-kw': { prefix: '/ar-kw', exceptions: ['about-us', 'contact-us', 'customer-stories'] },
    'qa': { prefix: '/en-qa', exceptions: ['about-us', 'contact-us', 'customer-stories'], removeNav: true },
    'ar-qa': { prefix: '/ar-qa', exceptions: ['about-us', 'contact-us', 'customer-stories'] },
    'bh': { prefix: '/en-bh', exceptions: ['about-us', 'contact-us', 'customer-stories'], removeNav: true },
    'ar-bh': { prefix: '/ar-bh', exceptions: ['about-us', 'contact-us', 'customer-stories'] },
    'eg': { prefix: '/en-eg', exceptions: ['about-us', 'contact-us', 'customer-stories'], removeNav: true },
    'ar-eg': { prefix: '/ar-eg', exceptions: ['about-us', 'contact-us', 'customer-stories'] },
    'main': { prefix: '' }
};

const noRedirectPaths = ['utm_', 'urbanpipervscompetidores', 'urbanpiper-versus-otherpossystems', 'uk/free-trial'];
const noRedirectLocales = ['en-kw', 'en-qa', 'en-bh', 'en-eg', 'en-ae', 'en-sa', 'ar-kw', 'ar-qa', 'ar-bh', 'ar-eg', 'ar-ae', 'ar-sa'];
const specialPages = ['restaurant-qsr', 'terms-of-service', 'privacy-policy', 'blog', 'integrations', 'e-commerce', 'punto-de-venta', 'a-propos', 'meraki', 'hub', 'case-study', 'case-studies-categories', 'customer-stories', 'legal'];

// Load external geodata script if not present
if (!document.querySelector('script[src="https://country-check.urbanpiper.workers.dev/script.js"]')) {
    const script = document.createElement('script');
    script.src = 'https://country-check.urbanpiper.workers.dev/script.js';
    document.head.appendChild(script);
}

function getLoc(country_code, country = '', lang = '') {
    const arabicCountries = ['ARE', 'DZA', 'BHR', 'IRN', 'IRQ', 'ISR', 'JOR', 'LBN', 'LBY', 'MAR', 'OMN', 'QAT', 'SYR', 'TUN', 'YEM', 'AE', 'DZ', 'IR', 'IQ', 'IL', 'JO', 'LB', 'LY', 'MA', 'OM', 'SY', 'TU', 'YE'];
    if (country_code === 'GBR' || country_code === 'EU' || country_code === 'GB' || country === 'uk') return 'uk';
    if (arabicCountries.includes(country_code) || (country === 'ae' && lang)) return lang === 'ar' ? 'ar-ae' : 'en-ae';
    if (country_code === 'USA' || country_code === 'US' || country === 'us') return 'us';
    if (country_code === 'AU' || country_code === 'AUS' || country === 'au') return 'au';
    if (country_code === 'CA' || country_code === 'CAN' || country === 'ca') return 'ca';
    if (country_code === 'IN') return 'in';
    if (country_code === 'FR' || country === 'fr') return 'fr';
    if (['MX', 'MEX', 'CO', 'COL', 'CL', 'CHL'].includes(country_code) || ['mx', 'co', 'cl'].includes(country) || (country === 'es' && lang === 'es')) return 'es';
    if (country_code === 'ES') return 'es-main';
    if (['SA', 'SAU', 'PK', 'PAK'].includes(country_code) || (country === 'sa' && lang)) return lang === 'ar' ? 'ar-sa' : 'ar';
    if (country_code === 'KW' || (country === 'kw' && lang === 'en')) return 'kw';
    if (country_code === 'QA' || (country === 'qa' && lang === 'en')) return 'qa';
    if (country_code === 'BH' || (country === 'bh' && lang === 'en')) return 'bh';
    if (country_code === 'EG' || (country === 'eg' && lang === 'en')) return 'eg';
    if (country === 'kw' && lang === 'ar') return 'ar-kw';
    if (country === 'qa' && lang === 'ar') return 'ar-qa';
    if (country === 'bh' && lang === 'ar') return 'ar-bh';
    if (country === 'eg' && lang === 'ar') return 'ar-eg';
    return 'main';
}

function setWithExpiry(key, value, ttl) {
    const item = { value, expiry: Date.now() + ttl };
    localStorage.setItem(key, JSON.stringify(item));
}

function getWithExpiry(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;
    const item = JSON.parse(itemStr);
    if (Date.now() > item.expiry) {
        localStorage.removeItem(key);
        return null;
    }
    return item.value;
}

function RedirectbyLoc(source = '', country = '', lang = '') {
    const url = new URL(window.location.href);
    let loc = source === 'drpdwn' ? getLoc('', country, lang) : getLoc(window.GEO_DATA?.country || 'main');
    let temploc = loc;
    let language = 'EN';
    let replaced = false;

    // Handle language and flag updates
    if (source === 'drpdwn') {
        setWithExpiry('source', 'drpdwn', 3600000);
        setWithExpiry('country', country, 3600000);
        setWithExpiry('lang', lang, 3600000);
    } else {
        if (loc === 'ar') { temploc = 'sa'; language = 'AR'; }
        else if (loc === 'es' || loc === 'es-main') { language = 'ES'; temploc = 'es'; }
        else if (loc === 'in') { temploc = 'india'; loc = 'main'; }
        else if (loc === 'eg') { temploc = 'eg'; }
    }

    const $languageBlock = $('.language-block');
    if ($(`.lpl-c-${temploc}`).length) {
        const imgSrc = window.getComputedStyle($(`.lpl-c-${temploc}`)[0], ':before').content.match(/"(.*?)"/)?.[1];
        if (imgSrc) {
            $languageBlock.find('img').attr('src', imgSrc);
            $languageBlock.find('.language-picker-title').text(language.toUpperCase());
        } else {
            console.warn(`No flag image found for country: ${temploc}`);
        }
    } else {
        console.warn(`No element found with class .lpl-c-${temploc}`);
    }

    // Show PRIME-POS for specific countries
    if (['in', 'us', 'au', 'es'].includes(country) || loc === 'es') {
        document.querySelectorAll('.js-prime-element').forEach(e => e.style.display = 'block');
    }

    // Clean URL
    let backlink = url.pathname.replace(/^(\/)?|\/$/g, '').replace(/^(uk|en-sa|ar-sa|ar-ae|en-ae|ae|us|es|ar-kw|ar-qa|ar-bh|ar-eg|ar|ca|au|en-kw|en-eg|en-bh|en-qa|fr|manage-online-orders\/(en-sa|ar-sa))(\/)?/, '');
    const tempReplaced = backlink;
    backlink = backlink.replace(/(https?:\/\/)|(\/)+/g, "$1$2");
    if (tempReplaced !== backlink) replaced = true;

    // Handle special pages
    let toUrl = backlink ? `/${backlink}` : '/';
    const rule = redirectRules[loc] || redirectRules['main'];

    if (['free-trial', '404'].includes(backlink)) {
        return;
    } else if (specialPages.includes(backlink) || backlink.startsWith('blog/') || backlink.startsWith('integrations/') || backlink.startsWith('case-study/') || backlink.startsWith('case-studies-categories/') || backlink.startsWith('legal/')) {
        if (['blog', 'integrations', 'case-study', 'case-studies-categories'].some(p => backlink === p || backlink.startsWith(`${p}/`))) {
            if (['uk', 'fr'].includes(loc)) {
                const nav = document.querySelector('nav[role="navigation"]');
                if (nav) {
                    nav.querySelector('.products')?.remove();
                    document.querySelectorAll('.section-footer .footer-right .footer-item:first-child *')?.forEach(e => e.remove());
                }
            }
            if (loc === 'uk' && backlink === 'integrations') {
                document.querySelector('.section-top-ribbon')?.classList.add('active');
                document.querySelector('.nav-dd.products')?.remove();
            }
            if (['kw', 'qa', 'bh', 'eg', 'sa'].includes(loc)) {
                document.querySelector('.nav-dd.products')?.remove();
            }
        } else if (['e-commerce', 'punto-de-venta'].includes(backlink)) {
            if (loc === 'es') toUrl = `/es/${backlink}`;
            else if (loc === 'es-main') toUrl = backlink === 'e-commerce' ? '/es' : `/es/${backlink}`;
            else if (['ar', 'uk', 'ae', 'fr'].includes(loc)) toUrl = `/${loc}`;
            else if (['au', 'ca', 'main'].includes(loc)) {
                if (backlink === 'e-commerce') backlink = 'meraki';
                if (backlink === 'punto-de-venta') backlink = 'prime-pos';
                toUrl = loc === 'main' ? `/${backlink}` : `/${loc}/${backlink}`;
            }
        } else if (backlink === 'a-propos') {
            if (loc === 'fr') toUrl = `/fr/${backlink}`;
            else if (['ar', 'uk', 'ae', 'es'].includes(loc)) toUrl = `/${loc}/about-us`;
            else if (['au', 'ca', 'main'].includes(loc)) toUrl = loc === 'main' ? '/about-us' : `/${loc}/about-us`;
        } else if (['meraki', 'hub'].includes(backlink)) {
            if (loc === 'es') {
                if (backlink === 'meraki') backlink = 'e-commerce';
                if (backlink === 'prime-pos') backlink = 'punto-de-venta';
                toUrl = `/es/${backlink}`;
            } else if (['au', 'ca', 'us'].includes(loc)) toUrl = `/${loc}/${backlink}`;
            else if (loc === 'ar') toUrl = '/ar';
            else if (loc === 'uk') toUrl = '/uk';
            else if (loc === 'fr') toUrl = '/fr';
            else if (loc === 'ae') toUrl = '/en-ae';
        } else if (backlink === 'customer-stories' && ['es', 'ar', 'ar-sa', 'fr'].includes(loc)) {
            if (loc === 'fr') {
                document.querySelector('.nav-dd.products')?.remove();
                const hubProducts = document.querySelector('.cc-navbar-single-hub-products');
                if (hubProducts) {
                    hubProducts.style.display = 'flex';
                }
            }
        } else if (['terms-of-service', 'privacy-policy'].includes(backlink) && ['uk', 'ae'].includes(loc)) {
            toUrl = `/${loc}/${backlink}`;
        }
    } else {
        if (rule.defaultPage && !backlink) toUrl = loc === 'main' ? rule.defaultPage : `${rule.prefix}${rule.defaultPage}`;
        else if (rule.exceptions?.includes(backlink)) toUrl = `/${backlink}`;
        else toUrl = `${rule.prefix}${backlink ? '/' + backlink : ''}`;
        if (rule.removeNav) document.querySelector('.nav-dd.products')?.remove();
    }

    if (url.pathname.replace(/(https?:\/\/)|(\/)+/g, "$1$2") !== toUrl) {
        window.location.href = toUrl;
    } else if (replaced) {
        history.pushState(null, null, toUrl);
    }
}

// Main redirection logic
const url = new URL(window.location.href);
if (noRedirectPaths.some(path => url.href.includes(path)) || noRedirectLocales.some(locale => url.href.includes(locale))) {
    let temploc = '';
    let lang = 'EN';
    if (url.href.includes('en-kw') || url.href.includes('ar-kw')) temploc = 'kw';
    else if (url.href.includes('en-qa') || url.href.includes('ar-qa')) temploc = 'qa';
    else if (url.href.includes('en-bh') || url.href.includes('ar-bh')) temploc = 'bh';
    else if (url.href.includes('en-eg') || url.href.includes('ar-eg')) temploc = 'eg';
    else if (url.href.includes('en-ae') || url.href.includes('ar-ae')) temploc = 'ae';
    else if (url.href.includes('en-sa') || url.href.includes('ar-sa')) temploc = 'sa';
    
    if ($(`.lpl-c-${temploc}`).length) {
        const imgSrc = window.getComputedStyle($(`.lpl-c-${temploc}`)[0], ':before').content.match(/"(.*?)"/)?.[1];
        if (imgSrc) {
            $('.language-block').find('img').attr('src', imgSrc);
            $('.language-block').find('.language-picker-title').text(lang.toUpperCase());
        } else {
            console.warn(`No flag image found for country: ${temploc}`);
        }
    } else {
        console.warn(`No element found with class .lpl-c-${temploc}`);
    }
} else {
    const source = getWithExpiry('source') || '';
    const country = getWithExpiry('country') || '';
    const lang = getWithExpiry('lang') || '';
    RedirectbyLoc(source, country, lang);
}

// Language dropdown handling
$(document).ready(function() {
    console.log('Language picker initialization started');
    const $languageBlock = $('.language-block');
    const $languageBlockMobile = $('.language-block-mobile');
    const $languagePickerDesktop = $('.language-picker-main.desktop');
    const $languagePickerMobile = $('.language-picker-main.mobile');

    // Log element existence
    console.log('Language block exists:', $languageBlock.length > 0);
    console.log('Language block mobile exists:', $languageBlockMobile.length > 0);
    console.log('Desktop picker exists:', $languagePickerDesktop.length > 0);
    console.log('Mobile picker exists:', $languagePickerMobile.length > 0);
    console.log('Desktop toggle exists:', $('#language-block-desktop').length > 0);
    console.log('Mobile toggle exists:', $('#language-block-mobile').length > 0);

    // Initial language setup
    const tempsource = getWithExpiry('source') || '';
    const tempcountry = getWithExpiry('country') || '';
    const templang = getWithExpiry('lang') || '';
    if (!noRedirectLocales.some(locale => url.href.includes(locale)) && tempsource && tempcountry && templang) {
        const imgSrc = window.getComputedStyle($(`.lpl-c-${tempcountry === 'in' ? 'india' : tempcountry}`)[0], ':before').content.match(/"(.*?)"/)?.[1];
        if (imgSrc) {
            $languageBlock.find('img').attr('src', imgSrc);
            $languageBlock.find('.language-picker-title').text(templang.toUpperCase());
        } else {
            console.warn(`No flag image found for initial country: ${tempcountry}`);
        }
    } else {
        console.warn('Initial language setup skipped: no stored source, country, or lang');
    }

    // Responsive language block toggle
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.matchMedia("(max-width: 992px)").matches) {
                $languageBlockMobile.show();
                $languageBlock.not('.language-block-mobile').hide();
            } else {
                $languageBlockMobile.hide();
                $languageBlock.not('.language-block-mobile').show();
            }
        }, 100);
    });

    // Initial check
    if (window.matchMedia("(max-width: 992px)").matches) {
        $languageBlockMobile.show();
        $languageBlock.not('.language-block-mobile').hide();
    } else {
        $languageBlockMobile.hide();
        $languageBlock.not('.language-block-mobile').show();
    }

    // Toggle language dropdown (using delegated event listeners)
    $(document).on('click', '#language-block-desktop', () => {
        console.log('Desktop language picker toggled');
        $languagePickerDesktop.toggle();
    });
    $(document).on('click', '#language-block-mobile', () => {
        console.log('Mobile language picker toggled');
        $languagePickerMobile.toggle();
    });

    // Country selection
    $(document).on('click', '[class*="lpl-c-"]', function() {
        const country = this.className.match(/lpl-c-(\w+)/)?.[1];
        if (!country) {
            console.warn('No country found in class name:', this.className);
            return;
        }
        console.log('Country selected:', country);
        const marginTop = country === 'ae' ? '304px' : country === 'sa' ? '252px' : '380px';
        const $colRight = $(this).closest('.language-picker-main').find('.language-col-right');
        if ($colRight.length) {
            if (parseInt($colRight.css('margin-right')) < 0) {
                $colRight.css({ 'border-left': '1px solid #3e495f' }).animate({ 'margin-right': '+=160' });
            }
            $(this).closest('.language-picker-main').find('.language-picker-list-es, .language-picker-list-ae, .language-picker-list-sa, .language-picker-list-kw, .language-picker-list-qa, .language-picker-list-bh, .language-picker-list-eg').hide();
            $(`.language-picker-list-${country}`).show();
            $('.language-col-right .language-picker-title').css('margin-top', marginTop);
        } else {
            console.warn('No .language-col-right element found');
        }
    });

    // Language selection and redirection
    $(document).on('click', '.language-picker-list li:not(.lpl-haschildren), .language-picker-list-ae li, .language-picker-list-sa li, .language-picker-list-es li, .language-picker-list-kw li, .language-picker-list-qa li, .language-picker-list-bh li, .language-picker-list-eg li', function() {
        const $this = $(this);
        const $colRight = $this.closest('.language-picker-main').find('.language-col-right');
        const mr = parseInt($colRight.css('margin-right'));
        let fin_country = $this.attr('country');
        let fin_lang = $this.attr('lang');
        if (fin_country === 'es') fin_country = $this.parent().attr('from');

        console.log('Language selected:', { country: fin_country, lang: fin_lang });

        const imgSrc = window.getComputedStyle($(`.lpl-c-${fin_country}`)[0], ':before').content.match(/"(.*?)"/)?.[1];
        if (imgSrc) {
            $languageBlock.find('img').attr('src', imgSrc);
            $languageBlock.find('.language-picker-title').text(fin_lang.toUpperCase());
        } else {
            console.warn(`No flag image found for country: ${fin_country}`);
        }

        if ($colRight.length && mr >= 0) {
            $colRight.css({ 'border-left': 'unset' }).animate({ 'margin-right': '-=160px' });
            setTimeout(() => {
                $this.closest('.language-picker-main').toggle();
                RedirectbyLoc('drpdwn', fin_country, fin_lang);
            }, 500);
        } else {
            $this.closest('.language-picker-main').toggle();
            RedirectbyLoc('drpdwn', fin_country, fin_lang);
        }
    });

    // Hide dropdown on outside click
    $(document).on('click', e => {
        if (!$(e.target).closest('.language-picker-main.desktop, #language-block-desktop').length) {
            console.log('Hiding desktop language picker');
            $languagePickerDesktop.hide();
        }
        if (!$(e.target).closest('.language-picker-main.mobile, #language-block-mobile').length) {
            console.log('Hiding mobile language picker');
            $languagePickerMobile.hide();
        }
    });

    // Blog link handling
    $(document).on('click', 'a', function(e) {
        e.preventDefault();
        const url_from = new URL(window.location.href);
        let url_to, backlink;
        const href = $(this).attr('href');
        if (/[a-zA-Z0-9]+:\/\/([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\.[A-Za-z]{2,4})(:[0-9]+)?(?:\/.*)?/.test(href)) {
            url_to = new URL(href);
            backlink = url_to.pathname.replace(/^(\/)?|\/$/g, '');
        } else {
            url_to = new URL(window.location.origin + href);
            backlink = href.replace(/^(\/)?|\/$/g, '');
        }

        if (url_from.pathname.split('/')[1] === 'blog' && url_to.pathname.split('/')[1] !== 'blog' && url_to.host === window.location.host) {
            const source = getWithExpiry('source') || '';
            const country = getWithExpiry('country') || '';
            const lang = getWithExpiry('lang') || '';
            let loc = source === 'drpdwn' ? getLoc('', country, lang) : getLoc(window.GEO_DATA?.country || 'main');
            let temploc = loc;
            let language = 'EN';

            if (loc === 'ar') { temploc = 'sa'; language = 'AR'; }
            else if (loc === 'es') language = 'ES';
            else if (loc === 'in') { temploc = 'india'; loc = 'main'; }

            if ($(`.lpl-c-${temploc}`).length) {
                const imgSrc = window.getComputedStyle($(`.lpl-c-${temploc}`)[0], ':before').content.match(/"(.*?)"/)?.[1];
                if (imgSrc) {
                    $languageBlock.find('img').attr('src', imgSrc);
                    $languageBlock.find('.language-picker-title').text(language.toUpperCase());
                } else {
                    console.warn(`No flag image found for blog link country: ${temploc}`);
                }
            } else {
                console.warn(`No element found with class .lpl-c-${temploc} for blog link`);
            }

            let toUrl = backlink ? `/${backlink}` : '/';
            if (loc === 'uk') toUrl = `/uk${backlink ? '/' + backlink : ''}`;
            else if (loc === 'fr') toUrl = `/fr${backlink ? '/' + backlink : ''}`;
            else if (loc === 'ae') toUrl = `/en-ae${backlink ? '/' + backlink : ''}`;

            if (toUrl !== '/#' && toUrl !== '#' && url_from.pathname.replace(/(https?:\/\/)|(\/)+/g, "$1$2") !== toUrl) {
                window.location.href = toUrl;
            }
        } else {
            window.location.href = href;
        }
    });

    console.log('Language picker initialization completed');
});
</script>
