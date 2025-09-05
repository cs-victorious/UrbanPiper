<!-- UTM Parameter Tracking Script -start -->
<script>
document.addEventListener('DOMContentLoaded', function() {
  // 1. Capture UTM params from URL and save to sessionStorage
  (function() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {};

    urlParams.forEach((value, key) => {
      if (key.startsWith('utm_')) {
        utmParams[key] = value;
      }
    });

    if (Object.keys(utmParams).length > 0) {
      sessionStorage.setItem('utmParams', JSON.stringify(utmParams));
    }
  })();

  // 2. Populate hidden UTM form fields on form pages
  (function() {
    const utmParams = JSON.parse(sessionStorage.getItem('utmParams') || '{}');
    if (Object.keys(utmParams).length === 0) return;

    for (const key in utmParams) {
      const input = document.querySelector(`input[name="${key}"]`);
      if (input) {
        input.value = utmParams[key];
      }
    }
  })();

  // 3. Handle form submission and redirect with UTM params
  const form = document.querySelector('.JS-Validated-Form'); // Updated selector
  if (form) {
    form.addEventListener('submit', function(event) {
      console.log('Form submit triggered');
      event.preventDefault();

      // Use Webflow’s native AJAX form submission
      const formData = new FormData(form);

      fetch(form.action, {
        method: form.method,
        body: formData,
        headers: { 'Accept': 'application/json' }
      }).then(response => {
        if (response.ok) {
          // Redirect with UTM params appended
          const utmParams = JSON.parse(sessionStorage.getItem('utmParams') || '{}');
          const paramsString = new URLSearchParams(utmParams).toString();
          const thankYouUrl = '/thank-you'; // Adjust to actual thank-you page path
          window.location.href = thankYouUrl + (paramsString ? '?' + paramsString : '');
        } else {
          alert('Form submission failed. Please try again.');
        }
      }).catch(() => alert('Form submission failed. Please try again.'));
    });
  }
});
</script>
<!-- UTM Parameter Tracking Script end -->
