// Main script for the portfolio site (mobile nav, video popups, portfolio filtering, FAQ accordions, and discord contact form)

$(document).ready(function () {
  // Automatically set the current year in the footer
  $('.current-year').text(new Date().getFullYear());

  // Mobile navigation menu toggle
  const $mobileMenuBtn = $('#mobile-menu-btn');
  const $mobileNavMenu = $('#mobile-nav-menu');
  const $menuIconOpen = $('#menu-icon-open');
  const $menuIconClose = $('#menu-icon-close');

  $mobileMenuBtn.on('click', function () {
    $mobileNavMenu.toggleClass('hidden');
    $menuIconOpen.toggleClass('hidden');
    $menuIconClose.toggleClass('hidden');
  });

  // Close the mobile menu whenever any navigation link inside it is clicked
  $('#mobile-nav-menu a').on('click', function () {
    $mobileNavMenu.addClass('hidden');
    $menuIconOpen.removeClass('hidden');
    $menuIconClose.addClass('hidden');
  });

  // Video popup modal (handles both vertical 9:16 shorts and horizontal 16:9 videos)
  const $videoModal = $('#video-modal');
  const $modalDialog = $('#modal-dialog');
  const $modalContainer = $('#modal-video-container');
  const $videoIframe = $('#modal-video-iframe');
  const $modalVideoPlayer = $('#modal-video-player');
  const $modalTitle = $('#modal-video-title');
  const $modalBadge = $('#modal-video-badge');
  const $modalSpinner = $('#modal-video-spinner');
  const $modalExternalLink = $('#modal-external-link');

  // Open video modal when clicking any video play button
  $(document).on('click', '.play-video-trigger', function (e) {
    e.preventDefault();
    const videoSrc = $(this).attr('data-video-src');
    const youtubeId = $(this).attr('data-youtube-id');
    const videoTitle = $(this).attr('data-title') || 'Featured Video Showcase';
    const orientation = $(this).attr('data-orientation') || 'landscape';

    $modalTitle.text(videoTitle);

    // Adjust modal dimensions based on video orientation (vertical shorts vs horizontal videos)
    if (orientation === 'portrait') {
      $modalDialog.removeClass('modal-landscape max-w-4xl').addClass('modal-portrait');
      $modalContainer.removeClass('video-responsive-wrapper').addClass('video-portrait-wrapper');
      if ($modalBadge.length) {
        $modalBadge.text('9:16 Portrait').removeClass('hidden text-blue-400 border-blue-500/40').addClass('text-cyan-400 border-cyan-500/40');
      }
    } else {
      $modalDialog.removeClass('modal-portrait').addClass('modal-landscape max-w-4xl');
      $modalContainer.removeClass('video-portrait-wrapper').addClass('video-responsive-wrapper');
      if ($modalBadge.length) {
        $modalBadge.text('16:9 Landscape').removeClass('hidden text-cyan-400 border-cyan-500/40').addClass('text-blue-400 border-blue-500/40');
      }
    }

    // Show loading spinner and hide the previous video while new one loads
    $modalSpinner.removeClass('hidden opacity-0').addClass('opacity-100');
    $videoIframe.removeClass('opacity-100').addClass('opacity-0');

    const isDirectVideo = videoSrc && /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(videoSrc);

    if (isDirectVideo && $modalVideoPlayer.length) {
      // Play local / direct video file using the HTML5 video player
      $videoIframe.addClass('hidden').attr('src', '');
      $modalVideoPlayer.removeClass('hidden').attr('src', videoSrc);

      $modalVideoPlayer.off('canplay').on('canplay', function () {
        $modalSpinner.addClass('opacity-0');
        setTimeout(function () {
          $modalSpinner.addClass('hidden');
        }, 200);
      });

      const playPromise = $modalVideoPlayer[0].play();
      if (playPromise !== undefined) {
        playPromise.catch(function () {});
      }

      if ($modalExternalLink.length) {
        $modalExternalLink.attr('href', videoSrc).removeClass('hidden');
      }
    } else {
      // Embed video player for YouTube or Google Drive preview links
      if ($modalVideoPlayer.length) {
        $modalVideoPlayer.addClass('hidden').attr('src', '');
        if ($modalVideoPlayer[0]) $modalVideoPlayer[0].pause();
      }
      $videoIframe.removeClass('hidden');

      // Hide loading spinner once the video iframe finishes loading
      $videoIframe.off('load').on('load', function () {
        $modalSpinner.addClass('opacity-0');
        setTimeout(function () {
          $modalSpinner.addClass('hidden');
        }, 250);
        $videoIframe.removeClass('opacity-0').addClass('opacity-100');
      });

      $videoIframe.attr('referrerpolicy', 'strict-origin-when-cross-origin');
      if (videoSrc) {
        $videoIframe.attr('src', videoSrc);
        if ($modalExternalLink.length) {
          $modalExternalLink.attr('href', videoSrc.replace('/preview', '/view')).removeClass('hidden');
        }
      } else if (youtubeId) {
        // Load YouTube embed with autoplay and clean controls
        const originParam = window.location.protocol.startsWith('http')
          ? '&origin=' + encodeURIComponent(window.location.origin)
          : '';
        const ytUrl = 'https://www.youtube.com/embed/' + youtubeId + '?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1' + originParam;
        $videoIframe.attr('src', ytUrl);
        if ($modalExternalLink.length) {
          $modalExternalLink.attr('href', 'https://youtu.be/' + youtubeId).removeClass('hidden');
        }
      }
    }

    $videoModal.removeClass('hidden').addClass('flex');
    $('body').addClass('overflow-hidden');
  });

  // Close the video modal and stop any active video playback
  function closeVideoModal() {
    $videoModal.addClass('hidden').removeClass('flex');
    if ($modalVideoPlayer.length) {
      $modalVideoPlayer.addClass('hidden').attr('src', '');
      if ($modalVideoPlayer[0]) $modalVideoPlayer[0].pause();
    }
    $videoIframe.attr('src', '').removeClass('opacity-100').addClass('opacity-0');
    $modalSpinner.removeClass('hidden opacity-0').addClass('opacity-100');
    if ($modalExternalLink.length) {
      $modalExternalLink.addClass('hidden').attr('href', '#');
    }
    $('body').removeClass('overflow-hidden');
  }

  // Close modal when clicking the close button
  $(document).on('click', '#close-video-modal, .close-video-modal-btn', function (e) {
    e.preventDefault();
    e.stopPropagation();
    closeVideoModal();
  });

  // Close modal when clicking outside the video container
  $(document).on('click', '.video-modal-backdrop', function (e) {
    e.preventDefault();
    closeVideoModal();
  });

  // Close modal when pressing the Escape key
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && !$videoModal.hasClass('hidden')) {
      closeVideoModal();
    }
  });

  // Filter portfolio items by category (all, shorts, promos, trailers)
  $('.filter-btn').on('click', function () {
    $('.filter-btn').removeClass('active text-white').addClass('text-slate-400');
    $(this).addClass('active text-white').removeClass('text-slate-400');

    const filter = $(this).attr('data-filter');
    const $items = $('.portfolio-item');

    if (filter === 'all') {
      $items.stop(true, true).fadeIn(350);
    } else {
      $items.stop(true, true).each(function () {
        if ($(this).hasClass(filter)) {
          $(this).fadeIn(350);
        } else {
          $(this).fadeOut(200);
        }
      });
    }
  });

  // FAQ accordion dropdowns (click to expand or collapse questions)
  $('.faq-header').on('click', function () {
    const $content = $(this).next('.faq-body');
    const $icon = $(this).find('.faq-chevron');
    const isOpen = !$content.hasClass('hidden');

    // Close any other open FAQ questions first
    $('.faq-body').addClass('hidden');
    $('.faq-chevron').removeClass('rotate-180 text-cyan-400');

    if (!isOpen) {
      $content.removeClass('hidden').hide().slideDown(250);
      $icon.addClass('rotate-180 text-cyan-400');
    }
  });

  // Contact form submission directly to my Discord channel via webhook
  const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1546141974267035798/AWwO43cRnfdLlcOaXpx1q8ZzwzabFL0oTbAb2L19GMKU0c_oHLolJN3xM569-ke8Zecp';

  $('#contact-form').on('submit', function (e) {
    e.preventDefault();

    const name = $('#contact-name').val().trim();
    const contactInfo = $('#contact-email').val().trim();
    const serviceVal = $('#contact-service').val();
    const serviceText = serviceVal ? $('#contact-service option:selected').text().trim() : 'Not Specified';
    const timelineVal = $('#contact-timeline').val();
    const timelineText = timelineVal ? $('#contact-timeline option:selected').text().trim() : 'Flexible / Not Specified';
    const footage = $('#contact-footage').val() ? $('#contact-footage').val().trim() : '';
    const message = $('#contact-message').val().trim();

    // Make sure required fields aren't empty
    if (!name || !contactInfo || !message) {
      showToast('Please fill in all required fields (Name, Contact, Message).', 'error');
      return;
    }

    if (contactInfo.length < 2) {
      showToast('Please provide a valid email address or Discord tag.', 'error');
      return;
    }

    const $submitBtn = $('#submit-btn');
    const originalText = $submitBtn.html();

    $submitBtn.prop('disabled', true).html(
      '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Sending to Discord...'
    );

    const discordPayload = {
      username: 'schmuckey',
      content: `<@521193255086587916>`,
      embeds: [
        {
          title: 'New Client Inquiry Received',
          description: `A new client inquiry was submitted through your **portfolio website**.`,
          color: 0x06b6d4, // Cyan #06b6d4
          fields: [
            {
              name: 'Client Name',
              value: name || 'Anonymous',
              inline: true
            },
            {
              name: 'Contact / Discord',
              value: contactInfo || 'Not provided',
              inline: true
            },
            {
              name: 'Service Needed',
              value: serviceText || 'Not Specified',
              inline: true
            },
            {
              name: 'Expected Timeline',
              value: timelineText || 'Flexible / Not Specified',
              inline: true
            },
            {
              name: 'Footage / Reference Link',
              value: footage ? (footage.length > 500 ? footage.substring(0, 497) + '...' : footage) : '*None provided*',
              inline: false
            },
            {
              name: 'Message / Project Details',
              value: message.length > 1000 ? message.substring(0, 997) + '...' : (message || '*None*'),
              inline: false
            }
          ],
          footer: {
            text: 'Schmuckey Portfolio • Automated Notification System',
            icon_url: 'https://cdn-icons-png.flaticon.com/512/906/906377.png'
          },
          timestamp: new Date().toISOString()
        }
      ]
    };

    // Only attach the avatar image if hosted online (Discord throws an error if given a localhost url)
    if (window.location && window.location.protocol === 'https:' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
      discordPayload.avatar_url = new URL('assets/images/zukohead.jpeg', window.location.href).href;
    }

    fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(discordPayload)
    })
    .then(async function (response) {
      if (response.ok) {
        $submitBtn.prop('disabled', false).html(
          '<i class="fa-solid fa-check mr-2 text-emerald-400"></i> Message Sent Successfully!'
        );
        setTimeout(function () {
          $submitBtn.html(originalText);
        }, 3500);
        $('#contact-form')[0].reset();
        showToast('Thank you for reaching out. We got your message and will get back to you as soon as we can!', 'success');
      } else {
        const errorText = await response.text().catch(function () { return ''; });
        throw new Error('Discord returned status ' + response.status + (errorText ? ': ' + errorText : ''));
      }
    })
    .catch(function (error) {
      console.error('Discord Webhook Error:', error);
      $submitBtn.prop('disabled', false).html(originalText);
      showToast('Something went wrong! Message was not delivered, please message me directly on Discord: @schmuck404', 'error');
    });
  });

  // Copy my Discord username (schmuck404) to clipboard when clicked
  $('#copy-discord-btn').on('click', function () {
    const discordTag = 'schmuck404';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(discordTag).then(function () {
        $('#copy-discord-text').text('Copied!');
        setTimeout(function () {
          $('#copy-discord-text').text('Click to Copy');
        }, 2000);
        showToast('Discord username "schmuck404" copied to clipboard!', 'success');
      }).catch(function () {
        showToast('Discord Tag: ' + discordTag, 'success');
      });
    } else {
      showToast('Discord Tag: ' + discordTag, 'success');
    }
  });

  // Popup toast notification helper (for success or error messages)
  function showToast(message, type) {
    let $toast = $('#toast-notification');
    if ($toast.length === 0) {
      $('body').append(`
        <div id="toast-notification" class="fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-xl shadow-2xl flex items-center gap-3 border backdrop-blur-md">
          <div id="toast-icon"></div>
          <div id="toast-msg" class="text-sm font-medium"></div>
        </div>
      `);
      $toast = $('#toast-notification');
    }

    const $toastIcon = $('#toast-icon');
    const $toastMsg = $('#toast-msg');

    if (type === 'error') {
      $toast.removeClass('bg-emerald-950/90 border-emerald-500/40 text-emerald-100')
            .addClass('bg-rose-950/90 border-rose-500/40 text-rose-100');
      $toastIcon.html('<i class="fa-solid fa-circle-exclamation text-rose-400 text-lg"></i>');
    } else {
      $toast.removeClass('bg-rose-950/90 border-rose-500/40 text-rose-100')
            .addClass('bg-slate-900/90 border-cyan-500/50 text-cyan-50 shadow-cyan-500/20');
      $toastIcon.html('<i class="fa-solid fa-circle-check text-cyan-400 text-lg"></i>');
    }

    $toastMsg.text(message);
    $toast.addClass('show');

    setTimeout(function () {
      $toast.removeClass('show');
    }, 4500);
  }

  // Back-to-top button (shows after scrolling down, smooth scrolls to top)
  const $backToTop = $('#back-to-top');
  if ($backToTop.length) {
    let scrollTicking = false;
    window.addEventListener('scroll', function () {
      if (!scrollTicking) {
        window.requestAnimationFrame(function () {
          if (window.scrollY > 400) {
            $backToTop.removeClass('opacity-0 pointer-events-none').addClass('opacity-100');
          } else {
            $backToTop.addClass('opacity-0 pointer-events-none').removeClass('opacity-100');
          }
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });

    $backToTop.on('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Clear admin session whenever visiting public pages so you always have to log in again
  try {
    sessionStorage.removeItem('schmuckey_admin_session');
  } catch (e) {}

  // Secret shortcut to open app login (Temporarily disabled for job application)
  /*
  $(document).on('keydown', function (e) {
    if ((e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) || (e.altKey && (e.key === 'A' || e.key === 'a'))) {
      e.preventDefault();
      window.location.href = 'app.php';
    }
  });
  */

  // Style select dropdowns so placeholder options look dimmer until selected
  function updateSelectPlaceholderState(sel) {
    const selectedOpt = sel.options[sel.selectedIndex];
    const isPlaceholder = !sel.value || (selectedOpt && selectedOpt.disabled);
    if (isPlaceholder) {
      sel.setAttribute('data-placeholder', 'true');
    } else {
      sel.removeAttribute('data-placeholder');
    }
  }

  $('select').each(function () {
    const sel = this;
    $(sel).on('change', function () {
      updateSelectPlaceholderState(sel);
    });
    updateSelectPlaceholderState(sel);
  });
});

