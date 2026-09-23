/**
 * Freelance Flow - Admin panel controller (MySQL Backend via PHP API)
 * 
 * Private dashboard to manage video projects, promotional brand deals, and client revenue.
 * Data and authentication are securely persisted in local MySQL database ('portfolio_tracker').
 * 
 * Sections:
 * 1. Video Tracker - tracks video status, pay rate, payment status, raw footage, and youtube links
 * 2. Promos Tracker - tracks sponsorship deals, platforms, deliverables, and rates
 * 3. Revenue & Cash Flow - summary of total earnings, paid vs unpaid balances, and client breakdown
 * 4. Add Project - quick form to add new video projects or promo deals
 */

(function () {
  'use strict';

  // In-memory cache synced with MySQL
  let cachedProjects = [];
  let cachedPromos = [];

  function isPaidStatus(status) {
    return status === 'Paid' || status === 'Completely Paid';
  }

  function getProjects() {
    return cachedProjects;
  }

  function getPromos() {
    return cachedPromos;
  }

  // ==========================================
  // API Synchronization Layer (MySQL Backend)
  // ==========================================

  async function syncAllData() {
    try {
      const [projRes, promoRes] = await Promise.all([
        fetch('api/projects.php', { credentials: 'same-origin' }),
        fetch('api/promos.php', { credentials: 'same-origin' })
      ]);

      if (projRes.status === 401 || promoRes.status === 401) {
        showLogin();
        return;
      }

      const [projJson, promoJson] = await Promise.all([projRes.json(), promoRes.json()]);

      if (projJson.success && Array.isArray(projJson.data)) {
        cachedProjects = projJson.data;
      }
      if (promoJson.success && Array.isArray(promoJson.data)) {
        cachedPromos = promoJson.data;
      }

      renderAll();
    } catch (err) {
      console.error('Failed to sync with MySQL:', err);
    }
  }

  async function createProjectApi(data) {
    try {
      const res = await fetch('api/projects.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'same-origin'
      });
      const json = await res.json();
      if (json.success && json.data) {
        cachedProjects.unshift(json.data);
        renderAll();
        return json.data;
      }
    } catch (err) {
      console.error('Failed to create project in database:', err);
    }
  }

  async function updateProjectApi(id, data) {
    try {
      const res = await fetch('api/projects.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
        credentials: 'same-origin'
      });
      const json = await res.json();
      if (json.success && json.data) {
        const idx = cachedProjects.findIndex(p => p.id === id);
        if (idx !== -1) cachedProjects[idx] = json.data;
        renderAll();
        return json.data;
      }
    } catch (err) {
      console.error('Failed to update project in database:', err);
    }
  }

  async function patchProjectApi(id, patchData) {
    try {
      const res = await fetch('api/projects.php', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...patchData }),
        credentials: 'same-origin'
      });
      const json = await res.json();
      if (json.success && json.data) {
        const idx = cachedProjects.findIndex(p => p.id === id);
        if (idx !== -1) cachedProjects[idx] = json.data;
        return json.data;
      }
    } catch (err) {
      console.error('Failed to patch project in database:', err);
    }
  }

  async function deleteProjectApi(id) {
    try {
      const res = await fetch(`api/projects.php?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'same-origin'
      });
      const json = await res.json();
      if (json.success) {
        cachedProjects = cachedProjects.filter(p => p.id !== id);
        renderAll();
      }
    } catch (err) {
      console.error('Failed to delete project from database:', err);
    }
  }

  async function createPromoApi(data) {
    try {
      const res = await fetch('api/promos.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'same-origin'
      });
      const json = await res.json();
      if (json.success && json.data) {
        cachedPromos.unshift(json.data);
        renderAll();
        return json.data;
      }
    } catch (err) {
      console.error('Failed to create promo in database:', err);
    }
  }

  async function updatePromoApi(id, data) {
    try {
      const res = await fetch('api/promos.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
        credentials: 'same-origin'
      });
      const json = await res.json();
      if (json.success && json.data) {
        const idx = cachedPromos.findIndex(pr => pr.id === id);
        if (idx !== -1) cachedPromos[idx] = json.data;
        renderAll();
        return json.data;
      }
    } catch (err) {
      console.error('Failed to update promo in database:', err);
    }
  }

  async function patchPromoApi(id, patchData) {
    try {
      const res = await fetch('api/promos.php', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...patchData }),
        credentials: 'same-origin'
      });
      const json = await res.json();
      if (json.success && json.data) {
        const idx = cachedPromos.findIndex(pr => pr.id === id);
        if (idx !== -1) cachedPromos[idx] = json.data;
        return json.data;
      }
    } catch (err) {
      console.error('Failed to patch promo in database:', err);
    }
  }

  async function deletePromoApi(id) {
    try {
      const res = await fetch(`api/promos.php?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'same-origin'
      });
      const json = await res.json();
      if (json.success) {
        cachedPromos = cachedPromos.filter(pr => pr.id !== id);
        renderAll();
      }
    } catch (err) {
      console.error('Failed to delete promo from database:', err);
    }
  }

  // Search filter query state
  let projectSearchQuery = '';
  let promoSearchQuery = '';

  // Cached DOM elements
  const $loginGate = document.getElementById('login-gate');
  const $adminApp = document.getElementById('admin-app');
  const $loginForm = document.getElementById('login-form');
  const $loginUser = document.getElementById('login-username');
  const $loginPass = document.getElementById('login-password');
  const $loginFeedback = document.getElementById('login-feedback');
  const $loginBtn = document.getElementById('login-btn');
  const $loginBtnText = document.getElementById('login-btn-text');
  const $loginBtnSpinner = document.getElementById('login-btn-spinner');
  const $togglePasswordBtn = document.getElementById('toggle-password-btn');

  // Initialize everything when the page loads
  document.addEventListener('DOMContentLoaded', () => {
    checkSession();
    initClock();
    initTabNavigation();
    initProjectManagement();
    initPromosManagement();
    initSecurityManagement();
    initSelectPlaceholders();
    setupStrictExit();
  });

  // Style dropdown placeholder options nicely
  function initSelectPlaceholders() {
    function updateSelectState(sel) {
      const selectedOpt = sel.options[sel.selectedIndex];
      const isPlaceholder = !sel.value || (selectedOpt && selectedOpt.disabled);
      if (isPlaceholder) {
        sel.setAttribute('data-placeholder', 'true');
      } else {
        sel.removeAttribute('data-placeholder');
      }
    }

    document.querySelectorAll('select').forEach((sel) => {
      sel.addEventListener('change', () => updateSelectState(sel));
      updateSelectState(sel);
    });
  }

  // Automatically log out when leaving the page or locking
  function setupStrictExit() {
    window.addEventListener('beforeunload', () => {
      fetch('api/auth.php?action=logout', { method: 'POST', credentials: 'same-origin', keepalive: true });
    });
    window.addEventListener('pagehide', () => {
      fetch('api/auth.php?action=logout', { method: 'POST', credentials: 'same-origin', keepalive: true });
    });

    document.querySelectorAll('.exit-to-portfolio-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          await fetch('api/auth.php?action=logout', { method: 'POST', credentials: 'same-origin' });
        } catch (err) {}
        window.location.href = 'index.html';
      });
    });

    document.querySelectorAll('.lock-console-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          await fetch('api/auth.php?action=logout', { method: 'POST', credentials: 'same-origin' });
        } catch (err) {}
        showLogin('Console locked. Enter credentials to unlock.', false);
      });
    });
  }

  // Account Settings: Change Username and Change Password backed by MySQL
  function initSecurityManagement() {
    const $btnOpen = document.getElementById('btn-open-security-modal');
    const $modal = document.getElementById('security-modal-dialog');
    const $btnClose = document.getElementById('btn-close-security-modal');
    const $cancelBtns = document.querySelectorAll('.btn-cancel-account-modal');
    const $feedback = document.getElementById('security-modal-feedback');

    // Tab buttons & forms
    const $tabUsername = document.getElementById('tab-opt-username');
    const $tabPassword = document.getElementById('tab-opt-password');
    const $formUsername = document.getElementById('form-change-username');
    const $formPassword = document.getElementById('form-change-password');

    // Username submit elements
    const $btnSubmitUser = document.getElementById('btn-submit-username');
    const $userBtnText = document.getElementById('username-btn-text');
    const $userBtnSpinner = document.getElementById('username-btn-spinner');

    // Password submit elements
    const $btnSubmitPass = document.getElementById('btn-submit-password');
    const $passBtnText = document.getElementById('pass-btn-text');
    const $passBtnSpinner = document.getElementById('pass-btn-spinner');

    function selectTab(tab) {
      if (!$formUsername || !$formPassword || !$tabUsername || !$tabPassword) return;
      if ($feedback) {
        $feedback.className = 'hidden';
        $feedback.textContent = '';
      }

      if (tab === 'username') {
        $formUsername.classList.remove('hidden');
        $formPassword.classList.add('hidden');
        $tabUsername.className = 'account-setting-tab flex-1 py-2 px-3 rounded-lg font-bold transition-all bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm flex items-center justify-center gap-2 cursor-pointer';
        $tabPassword.className = 'account-setting-tab flex-1 py-2 px-3 rounded-lg font-bold transition-all text-slate-400 hover:text-white flex items-center justify-center gap-2 cursor-pointer';
        const uInput = document.getElementById('input-new-username');
        if (uInput) setTimeout(() => uInput.focus(), 100);
      } else {
        $formUsername.classList.add('hidden');
        $formPassword.classList.remove('hidden');
        $tabPassword.className = 'account-setting-tab flex-1 py-2 px-3 rounded-lg font-bold transition-all bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm flex items-center justify-center gap-2 cursor-pointer';
        $tabUsername.className = 'account-setting-tab flex-1 py-2 px-3 rounded-lg font-bold transition-all text-slate-400 hover:text-white flex items-center justify-center gap-2 cursor-pointer';
        const pInput = document.getElementById('input-pass-current');
        if (pInput) setTimeout(() => pInput.focus(), 100);
      }
    }

    if ($tabUsername) $tabUsername.addEventListener('click', () => selectTab('username'));
    if ($tabPassword) $tabPassword.addEventListener('click', () => selectTab('password'));

    function openModal() {
      if ($formUsername) $formUsername.reset();
      if ($formPassword) $formPassword.reset();
      selectTab('username');
      if ($modal) $modal.classList.remove('hidden');
    }

    function closeModal() {
      if ($modal) $modal.classList.add('hidden');
    }

    if ($btnOpen) $btnOpen.addEventListener('click', openModal);
    if ($btnClose) $btnClose.addEventListener('click', closeModal);
    $cancelBtns.forEach(btn => btn.addEventListener('click', closeModal));

    if ($modal) {
      $modal.addEventListener('click', (e) => {
        if (e.target === $modal) closeModal();
      });
    }

    // Handle Change Username submit (requires current password)
    if ($formUsername) {
      $formUsername.addEventListener('submit', async (e) => {
        e.preventDefault();
        const currentPass = document.getElementById('input-user-current-pass')?.value || '';
        const newUsername = document.getElementById('input-new-username')?.value.trim() || '';

        if (!currentPass || !newUsername) {
          showFeedback('Both current password and new username are required.', true);
          return;
        }

        if (newUsername.length < 2) {
          showFeedback('Username must be at least 2 characters.', true);
          return;
        }

        if ($userBtnText) $userBtnText.classList.add('hidden');
        if ($userBtnSpinner) $userBtnSpinner.classList.remove('hidden');
        if ($btnSubmitUser) $btnSubmitUser.disabled = true;

        try {
          const res = await fetch('api/auth.php?action=change_username', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentPassword: currentPass, newUsername: newUsername }),
            credentials: 'same-origin'
          });

          const json = await res.json();

          if (res.ok && json.success) {
            closeModal();
            $formUsername.reset();
            showLogin('Username updated successfully. Please enter your new credentials to unlock.', false);
          } else {
            showFeedback(json.error || 'Failed to update username.', true);
          }
        } catch (err) {
          showFeedback('Connection error: ' + err.message, true);
        } finally {
          if ($userBtnText) $userBtnText.classList.remove('hidden');
          if ($userBtnSpinner) $userBtnSpinner.classList.add('hidden');
          if ($btnSubmitUser) $btnSubmitUser.disabled = false;
        }
      });
    }

    // Handle Change Password submit
    if ($formPassword) {
      $formPassword.addEventListener('submit', async (e) => {
        e.preventDefault();
        const oldPass = document.getElementById('input-pass-current')?.value || '';
        const newPass = document.getElementById('input-pass-new')?.value || '';
        const confirmPass = document.getElementById('input-pass-confirm')?.value || '';

        if (!oldPass || !newPass || !confirmPass) {
          showFeedback('All fields are required.', true);
          return;
        }

        if (newPass !== confirmPass) {
          showFeedback('New passwords do not match.', true);
          return;
        }

        if (newPass.length < 2) {
          showFeedback('Password must be at least 2 characters.', true);
          return;
        }

        if ($passBtnText) $passBtnText.classList.add('hidden');
        if ($passBtnSpinner) $passBtnSpinner.classList.remove('hidden');
        if ($btnSubmitPass) $btnSubmitPass.disabled = true;

        try {
          const res = await fetch('api/auth.php?action=change_password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass }),
            credentials: 'same-origin'
          });

          const json = await res.json();

          if (res.ok && json.success) {
            closeModal();
            $formPassword.reset();
            showLogin('Password updated successfully. Please enter your new credentials to unlock.', false);
          } else {
            showFeedback(json.error || 'Failed to update password.', true);
          }
        } catch (err) {
          showFeedback('Connection error: ' + err.message, true);
        } finally {
          if ($passBtnText) $passBtnText.classList.remove('hidden');
          if ($passBtnSpinner) $passBtnSpinner.classList.add('hidden');
          if ($btnSubmitPass) $btnSubmitPass.disabled = false;
        }
      });
    }

    function showFeedback(msg, isError) {
      if (!$feedback) return;
      $feedback.textContent = msg;
      $feedback.className = isError
        ? 'block mb-4 p-2.5 rounded-lg text-xs font-mono text-rose-400 bg-rose-950/50 border border-rose-500/40'
        : 'block mb-4 p-2.5 rounded-lg text-xs font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-500/40';
    }
  }

  // Require credentials on every entry to the admin portal
  async function checkSession() {
    showLogin();
    try {
      await fetch('api/auth.php?action=logout', { method: 'POST', credentials: 'same-origin' });
    } catch (e) {}
  }

  function showLogin(msg, isError) {
    if ($loginGate) $loginGate.classList.remove('hidden');
    if ($adminApp) $adminApp.classList.add('hidden');
    if ($loginFeedback && msg) {
      $loginFeedback.textContent = msg;
      $loginFeedback.className = isError
        ? 'text-xs text-rose-400 bg-rose-950/40 border border-rose-500/30 rounded-lg p-2.5 flex items-center gap-2 mb-4'
        : 'text-xs text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 rounded-lg p-2.5 flex items-center gap-2 mb-4';
      $loginFeedback.classList.remove('hidden');
    } else if ($loginFeedback) {
      $loginFeedback.classList.add('hidden');
    }
    if ($loginPass) $loginPass.value = '';
    if ($loginUser) {
      $loginUser.value = '';
      setTimeout(() => $loginUser.focus(), 150);
    }
  }

  function showDashboard() {
    if ($loginGate) $loginGate.classList.add('hidden');
    if ($adminApp) $adminApp.classList.remove('hidden');
    syncAllData();
  }

  // Handle login form submit (Backend Bcrypt Verification)
  if ($loginForm) {
    $loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const inputUser = $loginUser.value.trim();
      const inputPass = $loginPass.value;

      if (!inputUser || !inputPass) {
        showLogin('Please provide both identity and passphrase.', true);
        return;
      }

      if ($loginBtnText) $loginBtnText.classList.add('hidden');
      if ($loginBtnSpinner) $loginBtnSpinner.classList.remove('hidden');
      if ($loginBtn) $loginBtn.disabled = true;

      try {
        const res = await fetch('api/auth.php?action=login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: inputUser, password: inputPass }),
          credentials: 'same-origin'
        });

        const data = await res.json();

        if (res.ok && data.success) {
          const userDisplay = document.getElementById('current-user-display');
          if (userDisplay && data.user && data.user.username) {
            userDisplay.textContent = 'user: ' + data.user.username;
          }
          showDashboard();
        } else {
          if ($loginGate) {
            $loginGate.classList.add('shake-error');
            setTimeout(() => $loginGate.classList.remove('shake-error'), 500);
          }
          showLogin(data.error || 'Access Denied: Invalid credentials.', true);
        }
      } catch (err) {
        showLogin('Backend connection error: ' + err.message, true);
      } finally {
        if ($loginBtnText) $loginBtnText.classList.remove('hidden');
        if ($loginBtnSpinner) $loginBtnSpinner.classList.add('hidden');
        if ($loginBtn) $loginBtn.disabled = false;
      }
    });
  }

  // Show or hide password toggle
  if ($togglePasswordBtn && $loginPass) {
    $togglePasswordBtn.addEventListener('click', () => {
      const type = $loginPass.getAttribute('type') === 'password' ? 'text' : 'password';
      $loginPass.setAttribute('type', type);
      const icon = $togglePasswordBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
      }
    });
  }

  // Live digital clock in the header
  function initClock() {
    const $clock = document.getElementById('flow-clock');
    const $date = document.getElementById('flow-date');
    function tick() {
      const now = new Date();
      if ($clock) $clock.textContent = now.toLocaleTimeString('en-US', { hour12: false });
      if ($date) $date.textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
    tick();
    setInterval(tick, 1000);
  }

  // Tab switching helper (Videos, Promos, Cash Flow, Add Project)
  function switchTab(targetId) {
    const tabBtns = document.querySelectorAll('.nav-tab-btn');
    const tabPanels = document.querySelectorAll('.flow-tab-panel');

    tabBtns.forEach(b => {
      if (b.getAttribute('data-target') === targetId) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    tabPanels.forEach(panel => {
      if (panel.id === targetId) {
        panel.classList.remove('hidden');
      } else {
        panel.classList.add('hidden');
      }
    });
  }
  window.flowSwitchTab = switchTab;

  function initTabNavigation() {
    const tabBtns = document.querySelectorAll('.nav-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = btn.getAttribute('data-target');
        if (target) switchTab(target);
      });
    });
  }

  // Switch form fields and labels depending on video vs promo
  function updateProjectFormService(service) {
    const clientLabel = document.getElementById('label-proj-client');
    const clientInput = document.getElementById('proj-client-name');
    const priceInput = document.getElementById('proj-budget');
    const rawContainer = document.getElementById('container-proj-raw');
    const finalLabel = document.getElementById('label-proj-final');
    const finalInput = document.getElementById('proj-final-url');

    if (clientInput) clientInput.removeAttribute('placeholder');
    if (priceInput) priceInput.removeAttribute('placeholder');
    if (finalInput) finalInput.removeAttribute('placeholder');

    if (service === 'Promotional Video') {
      if (clientLabel) clientLabel.textContent = 'Client*';
      if (rawContainer) rawContainer.classList.add('hidden');
      if (finalLabel) finalLabel.textContent = 'Post Link (Once Sponsored Video is Posted)';
    } else {
      if (clientLabel) clientLabel.textContent = 'Client';
      if (rawContainer) rawContainer.classList.remove('hidden');
      if (finalLabel) finalLabel.textContent = 'Final Video Link (Optional)';
    }
  }

  // Debounce search input so table filtering doesn't lag while typing
  function debounce(fn, wait = 100) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  // Video Tracker (Table, Filters, Add/Edit, and Status Toggles)
  function initProjectManagement() {
    // Add new project form submit
    const $newProjForm = document.getElementById('new-project-form');
    if ($newProjForm) {
      $newProjForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const service = document.getElementById('proj-service')?.value || 'Video Editor';
        const clientDefault = service === 'Promotional Video' ? 'Sponsor' : 'Client';
        const clientName = document.getElementById('proj-client-name').value.trim() || clientDefault;
        const title = document.getElementById('proj-title').value.trim();
        const price = parseFloat(document.getElementById('proj-budget').value) || (service === 'Promotional Video' ? 25 : 15);
        const status = document.getElementById('proj-status')?.value || 'Not Started';
        const payment = document.getElementById('proj-payment')?.value || 'Unpaid';
        const rawUrl = document.getElementById('proj-raw-url').value.trim();
        const finalUrl = document.getElementById('proj-final-url').value.trim();

        const isPaid = payment === 'Paid';
        const paidAmount = isPaid ? price : 0;
        const paymentStatus = isPaid ? 'Paid' : 'Unpaid';

        if (service === 'Promotional Video') {
          await createPromoApi({
            title,
            clientName,
            platform: 'Instagram',
            price,
            paidAmount,
            paymentStatus,
            status,
            link: finalUrl || ''
          });
          $newProjForm.reset();
          updateProjectFormService(service);
          switchTab('panel-promos');
        } else {
          await createProjectApi({
            title,
            clientName,
            service,
            price,
            budget: price,
            paidAmount,
            paymentStatus,
            status,
            rawFilesUrl: rawUrl || '',
            youtubeLink: finalUrl || ''
          });
          $newProjForm.reset();
          updateProjectFormService(service);
          switchTab('panel-projects');
        }
      });
    }

    // Update form labels when changing the service dropdown
    const $projService = document.getElementById('proj-service');
    if ($projService) {
      $projService.addEventListener('change', (e) => {
        updateProjectFormService(e.target.value);
      });
    }

    // Filter dropdown for video status or payment
    const $statusFilter = document.getElementById('project-status-filter');
    if ($statusFilter) {
      $statusFilter.addEventListener('change', () => {
        renderSheetTable();
      });
    }

    // Search input for video title or client name
    const $searchInput = document.getElementById('project-search-input');
    if ($searchInput) {
      $searchInput.addEventListener('input', debounce((e) => {
        projectSearchQuery = e.target.value.toLowerCase().trim();
        renderSheetTable();
      }, 100));
    }

    // Add video button (switches to the Add Project tab)
    const $btnOpenAddVideo = document.getElementById('btn-open-add-video');
    if ($btnOpenAddVideo) {
      $btnOpenAddVideo.addEventListener('click', () => {
        window.flowOpenAddVideo();
      });
    }

    // Close edit video modal
    const $videoModal = document.getElementById('video-modal-dialog');
    const $btnCloseModal = document.getElementById('btn-close-video-modal');
    const $btnCancelModal = document.getElementById('btn-cancel-video-modal');

    if ($btnCloseModal) {
      $btnCloseModal.addEventListener('click', () => {
        window.flowCloseVideoModal();
      });
    }

    if ($btnCancelModal) {
      $btnCancelModal.addEventListener('click', () => {
        window.flowCloseVideoModal();
      });
    }

    if ($videoModal) {
      $videoModal.addEventListener('click', (e) => {
        if (e.target === $videoModal) {
          window.flowCloseVideoModal();
        }
      });
    }

    // Save edits from the video modal
    const $videoForm = document.getElementById('video-editor-form');
    if ($videoForm) {
      $videoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const editId = document.getElementById('edit-video-id')?.value;
        const title = document.getElementById('input-video-title').value.trim();
        const client = document.getElementById('input-video-client').value.trim() || 'Client';
        const service = document.getElementById('input-video-service')?.value || 'Video Editor';
        const status = document.getElementById('input-video-status').value || 'Not Started';
        const price = parseFloat(document.getElementById('input-video-price').value) || 15;
        const paymentVal = document.getElementById('input-video-payment').value;
        const link = document.getElementById('input-video-link').value.trim();
        const raw = document.getElementById('input-video-raw').value.trim();

        const isPaid = paymentVal === 'Paid';
        const paidAmount = isPaid ? price : 0;
        const paymentStatus = isPaid ? 'Paid' : 'Unpaid';

        if (editId) {
          await updateProjectApi(editId, {
            title,
            clientName: client,
            service,
            status,
            budget: price,
            price: price,
            paidAmount: paidAmount,
            paymentStatus: paymentStatus,
            youtubeLink: link,
            rawFilesUrl: raw
          });
        } else {
          await createProjectApi({
            title,
            clientName: client,
            service,
            budget: price,
            price: price,
            paidAmount: paidAmount,
            paymentStatus: paymentStatus,
            status: status,
            youtubeLink: link,
            rawFilesUrl: raw
          });
        }

        window.flowCloseVideoModal();
      });
    }
  }

  // Switch to Add Project tab with Video settings prefilled
  window.flowOpenAddVideo = function () {
    switchTab('panel-new-proj');
    const serviceSelect = document.getElementById('proj-service');
    if (serviceSelect) {
      serviceSelect.value = 'Video Editor';
      updateProjectFormService('Video Editor');
    }
    const clientInput = document.getElementById('proj-client-name');
    if (clientInput) clientInput.value = '';
    const priceInput = document.getElementById('proj-budget');
    if (priceInput && (!priceInput.value || priceInput.value === '25')) priceInput.value = '15';
    const titleInput = document.getElementById('proj-title');
    if (titleInput) {
      titleInput.value = '';
      titleInput.focus();
    }
  };

  window.flowOpenEditVideo = function (id) {
    const projects = getProjects();
    const p = projects.find(item => item.id === id);
    if (!p) return;
    const modal = document.getElementById('video-modal-dialog');
    const heading = document.getElementById('modal-video-heading');
    const editIdInput = document.getElementById('edit-video-id');
    if (!modal) return;
    if (editIdInput) editIdInput.value = p.id;
    if (heading) heading.textContent = 'Edit Video Row';

    const titleInput = document.getElementById('input-video-title');
    if (titleInput) titleInput.value = p.title || '';

    const clientInput = document.getElementById('input-video-client');
    if (clientInput) clientInput.value = p.clientName || '';

    const serviceSelect = document.getElementById('input-video-service');
    if (serviceSelect) serviceSelect.value = p.service || 'Video Editor';

    const statusSelect = document.getElementById('input-video-status');
    if (statusSelect) statusSelect.value = p.status || 'Not Started';

    const priceInput = document.getElementById('input-video-price');
    if (priceInput) priceInput.value = p.budget || p.price || 15;

    const paymentSelect = document.getElementById('input-video-payment');
    if (paymentSelect) paymentSelect.value = isPaidStatus(p.paymentStatus) ? 'Paid' : 'Unpaid';

    const linkInput = document.getElementById('input-video-link');
    if (linkInput) linkInput.value = p.youtubeLink || '';

    const rawInput = document.getElementById('input-video-raw');
    if (rawInput) rawInput.value = p.rawFilesUrl || '';

    modal.classList.remove('hidden');
  };

  window.flowCloseVideoModal = function () {
    const modal = document.getElementById('video-modal-dialog');
    if (modal) modal.classList.add('hidden');
  };

  // Cycle through status (Not Started -> In Progress -> Published)
  window.flowCycleStatus = async function (id) {
    const p = cachedProjects.find(item => item.id === id);
    if (!p) return;

    let nextStatus = 'In Progress';
    if (!p.status || p.status === 'Not Started' || p.status === "Haven't Started") {
      nextStatus = 'In Progress';
    } else if (p.status === 'In Progress') {
      nextStatus = 'Published';
    } else {
      nextStatus = 'Not Started';
    }

    p.status = nextStatus;
    renderSheetTable();
    renderRevenueOverview();
    await patchProjectApi(id, { status: nextStatus });
  };

  // Toggle between Paid and Unpaid status
  window.flowTogglePayment = async function (id) {
    const p = cachedProjects.find(item => item.id === id);
    if (!p) return;

    const price = p.budget || p.price || 15;
    const isPaid = isPaidStatus(p.paymentStatus);
    const newPaymentStatus = isPaid ? 'Unpaid' : 'Paid';
    const newPaidAmount = isPaid ? 0 : price;

    p.paymentStatus = newPaymentStatus;
    p.paidAmount = newPaidAmount;
    renderSheetTable();
    renderRevenueOverview();
    await patchProjectApi(id, { paymentStatus: newPaymentStatus, paidAmount: newPaidAmount });
  };

  // Delete video entry after confirmation
  window.flowDeleteProject = async function (id) {
    if (confirm('Are you sure you want to remove this video entry from MySQL?')) {
      cachedProjects = cachedProjects.filter(p => p.id !== id);
      renderSheetTable();
      renderRevenueOverview();
      await deleteProjectApi(id);
    }
  };

  // Colored status badge button
  function getStatusBadge(status, projectId, isPromo) {
    const s = status || 'Not Started';
    let badgeClass = '';
    let dotClass = '';
    let text = '';
    if (s === 'Published') {
      badgeClass = 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/10';
      dotClass = 'bg-emerald-400';
      text = 'Published';
    } else if (s === 'In Progress') {
      badgeClass = 'bg-amber-950/80 hover:bg-amber-900 text-amber-400 border-amber-500/40 shadow-sm shadow-amber-500/10';
      dotClass = 'bg-amber-400';
      text = 'In Progress';
    } else {
      badgeClass = 'bg-rose-950/80 hover:bg-rose-900 text-rose-400 border-rose-500/40 shadow-sm shadow-rose-500/10';
      dotClass = 'bg-rose-400';
      text = 'Not Started';
    }

    const clickFn = isPromo ? `window.flowCyclePromoStatus('${projectId}')` : `window.flowCycleStatus('${projectId}')`;

    return `
      <button 
        type="button" 
        onclick="${clickFn}" 
        class="px-2.5 py-1 rounded-full text-xs font-mono font-bold inline-flex items-center gap-1.5 border transition-all cursor-pointer ${badgeClass}"
        title="Click to cycle status: Not Started &rarr; In Progress &rarr; Published"
      >
        <span class="w-1.5 h-1.5 rounded-full ${dotClass}"></span>
        <span>${text}</span>
      </button>
    `;
  }

  // Render the video projects table
  function renderSheetTable() {
    const $container = document.getElementById('sheet-table-container');
    if (!$container) return;

    const projects = getProjects();
    const filter = document.getElementById('project-status-filter')?.value || 'All';

    let allProjectsPaid = 0;
    let allProjectsUnpaid = 0;
    const filtered = [];

    for (let i = 0; i < projects.length; i++) {
      const p = projects[i];
      const price = p.budget || p.price || 0;
      const isPaid = isPaidStatus(p.paymentStatus);
      if (isPaid) {
        allProjectsPaid += price;
      } else {
        allProjectsUnpaid += price;
      }

      const status = p.status || 'Not Started';
      if (filter === 'Published' && status !== 'Published') continue;
      if (filter === 'In Progress' && status !== 'In Progress') continue;
      if (filter === 'Not Started' && status !== 'Not Started' && status !== "Haven't Started") continue;
      if (filter === 'Unpaid' && isPaid) continue;
      if (filter === 'Paid' && !isPaid) continue;

      if (projectSearchQuery) {
        const str = `${p.title} ${p.clientName} ${status} ${p.service || ''} ${p.paymentStatus || ''} ${p.youtubeLink || ''}`.toLowerCase();
        if (!str.includes(projectSearchQuery)) continue;
      }

      filtered.push(p);
    }

    const $projCount = document.getElementById('project-total-count');
    const $projPaid = document.getElementById('project-paid-amount');
    const $projUnpaid = document.getElementById('project-unpaid-amount');

    if ($projCount) $projCount.textContent = `${projects.length} Videos`;
    if ($projPaid) $projPaid.textContent = `$${allProjectsPaid.toFixed(2)}`;
    if ($projUnpaid) $projUnpaid.textContent = `$${allProjectsUnpaid.toFixed(2)}`;

    let totalTablePrice = 0;
    let totalTablePaid = 0;
    let totalTableUnpaid = 0;

    const rowsHtml = filtered.length > 0
      ? filtered.map((p, idx) => {
          const isPaid = isPaidStatus(p.paymentStatus);
          const price = p.budget || p.price || 0;
          const paid = isPaid ? price : 0;
          totalTablePrice += price;
          totalTablePaid += paid;
          totalTableUnpaid += isPaid ? 0 : price;

          const isLinkUrl = p.youtubeLink && (p.youtubeLink.startsWith('http://') || p.youtubeLink.startsWith('https://'));
          const rawLink = p.rawFilesUrl || p.rawLink || '';
          const hasRaw = rawLink && (rawLink.startsWith('http://') || rawLink.startsWith('https://'));

          return `
            <tr class="${!isPaid ? 'row-unpaid' : ''}">
              <td class="font-mono text-slate-500 text-center font-semibold w-10">
                ${idx + 1}
              </td>
              <td>
                <div class="flex flex-col">
                  <span class="font-bold text-white text-sm hover:text-cyan-300 transition-colors cursor-pointer" onclick="window.flowOpenEditVideo('${p.id}')" title="Click to edit video details">
                    ${escapeHtml(p.title)}
                  </span>
                  <span class="text-[11px] text-slate-400 font-mono mt-0.5">
                    client: <span class="text-slate-300 font-medium">${escapeHtml(p.clientName || 'Client')}</span>
                  </span>
                </div>
              </td>
              <td>
                ${getStatusBadge(p.status, p.id, false)}
              </td>
              <td>
                <button 
                  type="button" 
                  onclick="window.flowTogglePayment('${p.id}')" 
                  class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                    isPaid 
                      ? 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border-emerald-500/40' 
                      : 'bg-amber-950/90 hover:bg-amber-900 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/10'
                  }"
                  title="Click to toggle Paid / Unpaid"
                >
                  <i class="fa-solid ${isPaid ? 'fa-circle-check text-emerald-400' : 'fa-hourglass-half text-amber-400'}"></i>
                  <span>${isPaid ? 'Paid' : 'Unpaid'}</span>
                </button>
              </td>
              <td class="font-mono text-slate-200 font-semibold text-right">
                $${price.toFixed(2)}
              </td>
              <td class="font-mono font-bold text-right pr-6 ${isPaid ? 'text-emerald-400' : 'text-slate-500'}">
                $${paid.toFixed(2)}
              </td>
              <td class="text-center px-4">
                ${hasRaw ? `
                  <a href="${escapeHtml(rawLink)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-950/50 hover:bg-cyan-900 text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-mono transition-colors group" title="Open raw footage in Google Drive / Dropbox">
                    <i class="fa-solid fa-folder-open text-cyan-400 group-hover:scale-110 transition-transform"></i>
                    <span>Raw</span>
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px] opacity-70"></i>
                  </a>
                ` : `<span class="text-slate-600 text-xs font-mono italic">—</span>`}
              </td>
              <td class="text-center px-4">
                ${isLinkUrl ? `
                  <a href="${escapeHtml(p.youtubeLink)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-950/50 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-mono transition-colors group" title="Watch YouTube video">
                    <i class="fa-brands fa-youtube text-rose-400 group-hover:scale-110 transition-transform"></i>
                    <span>Short</span>
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px] opacity-70"></i>
                  </a>
                ` : (p.youtubeLink ? `
                  <a href="https://youtube.com/shorts" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-950/50 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-mono transition-colors">
                    <i class="fa-brands fa-youtube text-rose-400"></i>
                    <span>${escapeHtml(p.youtubeLink)}</span>
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px] opacity-70"></i>
                  </a>
                ` : `<span class="text-slate-600 text-xs font-mono italic">—</span>`)}
              </td>
              <td>
                <div class="flex items-center gap-1.5 justify-end">
                  <button 
                    onclick="window.flowOpenEditVideo('${p.id}')" 
                    class="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-400 text-xs transition-colors cursor-pointer"
                    title="Edit video"
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button 
                    onclick="window.flowDeleteProject('${p.id}')" 
                    class="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                    title="Delete video"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          `;
        }).join('')
      : `<tr><td colspan="9" class="p-8 text-center text-slate-500 italic">No video entries match the current filter or search criteria.</td></tr>`;

    const fullBodyHtml = rowsHtml + `<tr class="sheet-table-spacer"><td colspan="9"></td></tr>`;

    const footHtml = `
      <tr>
        <td colspan="4" class="text-slate-300">
          <div class="flex items-center gap-3">
            <span class="text-cyan-400 font-bold">${filtered.length} Videos Tracked</span>
            <span class="text-slate-600">&bull;</span>
            <span class="text-xs text-slate-400 font-normal">Matching Filter</span>
          </div>
        </td>
        <td class="text-right text-white font-mono font-black">
          $${totalTablePrice.toFixed(2)}
        </td>
        <td class="text-right text-emerald-400 font-mono font-black pr-6">
          $${totalTablePaid.toFixed(2)}
        </td>
        <td colspan="3" class="text-right">
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-950/90 border border-amber-500/50 text-amber-300 font-mono text-xs font-bold">
            <i class="fa-solid fa-hourglass-half"></i>
            <span>Total Unpaid: $${totalTableUnpaid.toFixed(2)}</span>
          </span>
        </td>
      </tr>
    `;

    const $existingTbody = $container.querySelector('#sheet-table-tbody');
    const $existingTfoot = $container.querySelector('#sheet-table-tfoot');

    if ($existingTbody && $existingTfoot) {
      $existingTbody.innerHTML = fullBodyHtml;
      $existingTfoot.innerHTML = footHtml;
      return;
    }

    $container.innerHTML = `
      <div class="sheet-table-wrapper flow-scrollbar flex-1 min-h-0 overflow-auto">
        <table class="sheet-table">
          <thead>
            <tr>
              <th class="text-center w-12">#</th>
              <th class="text-left">Video Title</th>
              <th class="text-left">Status</th>
              <th class="text-left">Payment</th>
              <th class="text-right">Price</th>
              <th class="text-right pr-6">Amount Paid</th>
              <th class="text-center px-4">Raw Footage</th>
              <th class="text-center px-4">Final Video</th>
              <th class="text-right">Quick Actions</th>
            </tr>
          </thead>
          <tbody id="sheet-table-tbody">
            ${fullBodyHtml}
          </tbody>
          <tfoot id="sheet-table-tfoot">
            ${footHtml}
          </tfoot>
        </table>
      </div>
    `;
  }

  // Promos Tracker (Sponsorships and Brand Deals)
  function initPromosManagement() {
    // Search input for promo client or campaign title
    const $promoSearch = document.getElementById('promo-search-input');
    if ($promoSearch) {
      $promoSearch.addEventListener('input', debounce((e) => {
        promoSearchQuery = e.target.value.toLowerCase().trim();
        renderPromosTable();
      }, 100));
    }

    // Filter dropdown for promo status or payment
    const $promoFilter = document.getElementById('promo-status-filter');
    if ($promoFilter) {
      $promoFilter.addEventListener('change', () => {
        renderPromosTable();
      });
    }

    // Add promo button (switches to the Add Project tab)
    const $btnOpenAddPromo = document.getElementById('btn-open-add-promo');
    if ($btnOpenAddPromo) {
      $btnOpenAddPromo.addEventListener('click', () => {
        window.flowOpenAddPromo();
      });
    }

    // Close edit promo modal
    const $promoModal = document.getElementById('promo-modal-dialog');
    const $btnClosePromoModal = document.getElementById('btn-close-promo-modal');
    const $btnCancelPromoModal = document.getElementById('btn-cancel-promo-modal');

    if ($btnClosePromoModal) {
      $btnClosePromoModal.addEventListener('click', () => {
        window.flowClosePromoModal();
      });
    }

    if ($btnCancelPromoModal) {
      $btnCancelPromoModal.addEventListener('click', () => {
        window.flowClosePromoModal();
      });
    }

    if ($promoModal) {
      $promoModal.addEventListener('click', (e) => {
        if (e.target === $promoModal) {
          window.flowClosePromoModal();
        }
      });
    }

    // Save edits from the promo modal
    const $promoForm = document.getElementById('promo-editor-form');
    if ($promoForm) {
      $promoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const editId = document.getElementById('edit-promo-id')?.value;
        const client = document.getElementById('input-promo-client').value.trim();
        const title = document.getElementById('input-promo-title').value.trim();
        const price = parseFloat(document.getElementById('input-promo-price').value) || 25;
        const status = document.getElementById('input-promo-status').value || 'Not Started';
        const paymentVal = document.getElementById('input-promo-payment').value;
        const link = document.getElementById('input-promo-link').value.trim();

        const isPaid = paymentVal === 'Paid';
        const paidAmount = isPaid ? price : 0;
        const paymentStatus = isPaid ? 'Paid' : 'Unpaid';

        if (editId) {
          await updatePromoApi(editId, {
            clientName: client,
            title,
            price,
            status,
            paidAmount,
            paymentStatus,
            link
          });
        } else {
          await createPromoApi({
            title,
            clientName: client,
            price,
            paidAmount,
            paymentStatus,
            status,
            link
          });
        }

        window.flowClosePromoModal();
      });
    }
  }

  // Switch to Add Project tab with Promotional Video prefilled
  window.flowOpenAddPromo = function () {
    switchTab('panel-new-proj');
    const serviceSelect = document.getElementById('proj-service');
    if (serviceSelect) {
      serviceSelect.value = 'Promotional Video';
      updateProjectFormService('Promotional Video');
    }
    const clientInput = document.getElementById('proj-client-name');
    if (clientInput) clientInput.value = '';
    const priceInput = document.getElementById('proj-budget');
    if (priceInput && (!priceInput.value || priceInput.value === '15')) priceInput.value = '25';
    const titleInput = document.getElementById('proj-title');
    if (titleInput) {
      titleInput.value = '';
      titleInput.focus();
    }
  };

  window.flowOpenEditPromo = function (id) {
    const promos = getPromos();
    const pr = promos.find(item => item.id === id);
    if (!pr) return;
    const modal = document.getElementById('promo-modal-dialog');
    const heading = document.getElementById('modal-promo-heading');
    const editIdInput = document.getElementById('edit-promo-id');
    if (!modal) return;
    if (editIdInput) editIdInput.value = pr.id;
    if (heading) heading.textContent = 'Edit Promo Deal';

    const clientInput = document.getElementById('input-promo-client');
    if (clientInput) clientInput.value = pr.clientName || '';

    const titleInput = document.getElementById('input-promo-title');
    if (titleInput) titleInput.value = pr.title || '';

    const priceInput = document.getElementById('input-promo-price');
    if (priceInput) priceInput.value = pr.price || 25;

    const statusSelect = document.getElementById('input-promo-status');
    if (statusSelect) statusSelect.value = pr.status || 'Not Started';

    const paymentSelect = document.getElementById('input-promo-payment');
    if (paymentSelect) paymentSelect.value = isPaidStatus(pr.paymentStatus) ? 'Paid' : 'Unpaid';

    const linkInput = document.getElementById('input-promo-link');
    if (linkInput) linkInput.value = pr.link || '';

    modal.classList.remove('hidden');
  };

  window.flowClosePromoModal = function () {
    const modal = document.getElementById('promo-modal-dialog');
    if (modal) modal.classList.add('hidden');
  };

  // Quick prompt popup to paste the live sponsored video URL
  window.flowPromptPromoLink = async function (id) {
    const pr = cachedPromos.find(item => item.id === id);
    if (!pr) return;
    const currentLink = pr.link || '';
    const newLink = prompt('Enter sponsored post URL once posted:', currentLink);
    if (newLink !== null) {
      pr.link = newLink.trim();
      renderPromosTable();
      await patchPromoApi(id, { link: newLink.trim() });
    }
  };

  // Cycle promo status (Not Started -> In Progress -> Published)
  window.flowCyclePromoStatus = async function (id) {
    const pr = cachedPromos.find(item => item.id === id);
    if (!pr) return;

    let nextStatus = 'In Progress';
    if (!pr.status || pr.status === 'Not Started' || pr.status === "Haven't Started") {
      nextStatus = 'In Progress';
    } else if (pr.status === 'In Progress') {
      nextStatus = 'Published';
    } else {
      nextStatus = 'Not Started';
    }

    pr.status = nextStatus;
    renderPromosTable();
    renderRevenueOverview();
    await patchPromoApi(id, { status: nextStatus });
  };

  // Toggle between Paid and Unpaid for promo deals
  window.flowTogglePromoPayment = async function (id) {
    const pr = cachedPromos.find(item => item.id === id);
    if (!pr) return;

    const price = pr.price || 25;
    const isPaid = isPaidStatus(pr.paymentStatus);
    const newPaymentStatus = isPaid ? 'Unpaid' : 'Paid';
    const newPaidAmount = isPaid ? 0 : price;

    pr.paymentStatus = newPaymentStatus;
    pr.paidAmount = newPaidAmount;
    renderPromosTable();
    renderRevenueOverview();
    await patchPromoApi(id, { paymentStatus: newPaymentStatus, paidAmount: newPaidAmount });
  };

  // Delete promo entry after confirmation
  window.flowDeletePromo = async function (id) {
    if (confirm('Are you sure you want to remove this promotional deal from MySQL?')) {
      cachedPromos = cachedPromos.filter(pr => pr.id !== id);
      renderPromosTable();
      renderRevenueOverview();
      await deletePromoApi(id);
    }
  };

  // Render the promotional deals table
  function renderPromosTable() {
    const $container = document.getElementById('promos-table-container');
    if (!$container) return;

    const promos = getPromos();
    const filter = document.getElementById('promo-status-filter')?.value || 'All';

    // Single-pass calculation for metrics and filtering
    let activePromosCount = 0;
    let promoTotalPaid = 0;
    let promoTotalUnpaid = 0;
    const filtered = [];

    for (let i = 0; i < promos.length; i++) {
      const pr = promos[i];
      const price = pr.price || 0;
      const isPaid = isPaidStatus(pr.paymentStatus);
      const paid = isPaid ? price : 0;
      if (pr.status === 'In Progress' || pr.status === 'Not Started') {
        activePromosCount++;
      }
      promoTotalPaid += paid;
      promoTotalUnpaid += isPaid ? 0 : price;

      const status = pr.status || 'Not Started';
      if (filter === 'Published' && status !== 'Published') continue;
      if (filter === 'In Progress' && status !== 'In Progress') continue;
      if (filter === 'Not Started' && status !== 'Not Started' && status !== "Haven't Started") continue;
      if (filter === 'Unpaid' && isPaid) continue;
      if (filter === 'Paid' && !isPaid) continue;

      if (promoSearchQuery) {
        const str = `${pr.title} ${pr.clientName} ${status} ${pr.paymentStatus || ''}`.toLowerCase();
        if (!str.includes(promoSearchQuery)) continue;
      }

      filtered.push(pr);
    }

    const $activeCount = document.getElementById('promo-active-count');
    const $paidAmount = document.getElementById('promo-paid-amount');
    const $unpaidAmount = document.getElementById('promo-unpaid-amount');

    if ($activeCount) $activeCount.textContent = `${promos.length} Deals`;
    if ($paidAmount) $paidAmount.textContent = `$${promoTotalPaid.toFixed(2)}`;
    if ($unpaidAmount) $unpaidAmount.textContent = `$${promoTotalUnpaid.toFixed(2)}`;

    // Show message if no promo deals are logged yet
    if (promos.length === 0) {
      $container.innerHTML = `
        <div class="flow-card p-10 sm:p-14 rounded-2xl border border-purple-500/25 text-center space-y-3">
          <div class="w-14 h-14 rounded-2xl bg-purple-950/60 border border-purple-500/40 text-purple-400 flex items-center justify-center mx-auto text-xl shadow-lg shadow-purple-500/10">
            <i class="fa-solid fa-bullhorn"></i>
          </div>
          <h3 class="text-lg font-heading font-bold text-white">No Promotional Deals Logged Yet</h3>
          <div class="pt-2">
            <button onclick="window.flowOpenAddPromo()" class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors cursor-pointer">
              <i class="fa-solid fa-plus mr-1.5"></i> Add First Deal
            </button>
          </div>
        </div>
      `;
      return;
    }

    let tablePrice = 0;
    let tablePaid = 0;
    let tableUnpaid = 0;

    const rowsHtml = filtered.length > 0
      ? filtered.map((pr, idx) => {
          const isPaid = isPaidStatus(pr.paymentStatus);
          const price = pr.price || 0;
          const paid = isPaid ? price : 0;
          tablePrice += price;
          tablePaid += paid;
          tableUnpaid += isPaid ? 0 : price;
          const isLinkUrl = pr.link && (pr.link.startsWith('http://') || pr.link.startsWith('https://'));

          return `
        <tr class="${!isPaid ? 'row-unpaid' : ''}">
          <td class="font-mono text-slate-500 text-center font-semibold w-10">
            ${idx + 1}
          </td>
          <td>
            <div class="flex flex-col">
              <span class="font-bold text-white text-sm hover:text-purple-300 transition-colors cursor-pointer" onclick="window.flowOpenEditPromo('${pr.id}')" title="Click to edit promo deal details">
                ${escapeHtml(pr.clientName || pr.title || 'Client')}
              </span>
              ${pr.title && pr.title !== pr.clientName ? `
                <span class="text-[11px] text-slate-400 font-mono mt-0.5">
                  ${escapeHtml(pr.title)}
                </span>
              ` : ''}
            </div>
          </td>
          <td>
            ${getStatusBadge(pr.status, pr.id, true)}
          </td>
          <td>
            <button 
              type="button" 
              onclick="window.flowTogglePromoPayment('${pr.id}')" 
              class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                isPaid 
                  ? 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border-emerald-500/40' 
                  : 'bg-amber-950/90 hover:bg-amber-900 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/10'
              }"
              title="Click to toggle Paid / Unpaid"
            >
              <i class="fa-solid ${isPaid ? 'fa-circle-check text-emerald-400' : 'fa-hourglass-half text-amber-400'}"></i>
              <span>${isPaid ? 'Paid' : 'Unpaid'}</span>
            </button>
          </td>
          <td class="font-mono text-slate-200 font-semibold text-right">
            $${price.toFixed(2)}
          </td>
          <td class="font-mono font-bold text-right pr-6 ${isPaid ? 'text-emerald-400' : 'text-slate-500'}">
            $${paid.toFixed(2)}
          </td>
          <td class="text-center px-4">
            ${isLinkUrl ? `
              <div class="inline-flex items-center gap-1.5 justify-center">
                <a href="${escapeHtml(pr.link)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-mono transition-colors group" title="Open published sponsored post">
                  <i class="fa-solid fa-arrow-up-right-from-square text-purple-400 group-hover:scale-110 transition-transform"></i>
                  <span>Post</span>
                </a>
                <button type="button" onclick="window.flowPromptPromoLink('${pr.id}')" class="p-1 text-slate-500 hover:text-purple-300 transition-colors cursor-pointer" title="Edit post link">
                  <i class="fa-solid fa-pen text-[10px]"></i>
                </button>
              </div>
            ` : `
              <button 
                type="button" 
                onclick="window.flowPromptPromoLink('${pr.id}')" 
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-purple-950/50 text-slate-400 hover:text-purple-300 border border-slate-700 hover:border-purple-500/40 text-xs font-mono transition-all cursor-pointer" 
                title="Put link once sponsored video is posted"
              >
                <i class="fa-solid fa-plus text-[10px]"></i>
                <span>Put Link</span>
              </button>
            `}
          </td>
          <td>
            <div class="flex items-center gap-1.5 justify-end">
              <button 
                onclick="window.flowOpenEditPromo('${pr.id}')" 
                class="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-purple-400 text-xs transition-colors cursor-pointer"
                title="Edit deal"
              >
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button 
                onclick="window.flowDeletePromo('${pr.id}')" 
                class="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                title="Delete deal"
              >
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
        }).join('')
      : `<tr><td colspan="8" class="p-8 text-center text-slate-500 italic">No promotional deals match the current filter or search criteria.</td></tr>`;

    const fullBodyHtml = rowsHtml + `<tr class="sheet-table-spacer"><td colspan="8"></td></tr>`;

    const footHtml = `
      <tr>
        <td colspan="4" class="text-slate-300">
          <div class="flex items-center gap-3">
            <span class="text-purple-400 font-bold">${filtered.length} Deals Tracked</span>
            <span class="text-slate-600">&bull;</span>
            <span class="text-xs text-slate-400 font-normal">Matching Filter</span>
          </div>
        </td>
        <td class="text-right text-white font-mono font-black">
          $${tablePrice.toFixed(2)}
        </td>
        <td class="text-right text-emerald-400 font-mono font-black pr-6">
          $${tablePaid.toFixed(2)}
        </td>
        <td colspan="2" class="text-right">
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-950/90 border border-amber-500/50 text-amber-300 font-mono text-xs font-bold">
            <i class="fa-solid fa-hourglass-half"></i>
            <span>Total Unpaid: $${tableUnpaid.toFixed(2)}</span>
          </span>
        </td>
      </tr>
    `;

    const $existingTbody = $container.querySelector('#promos-table-tbody');
    const $existingTfoot = $container.querySelector('#promos-table-tfoot');

    if ($existingTbody && $existingTfoot) {
      $existingTbody.innerHTML = fullBodyHtml;
      $existingTfoot.innerHTML = footHtml;
      return;
    }

    $container.innerHTML = `
      <div class="sheet-table-wrapper flow-scrollbar flex-1 min-h-0 overflow-auto">
        <table class="sheet-table">
          <thead>
            <tr>
              <th class="text-center w-12">#</th>
              <th class="text-left">Client</th>
              <th class="text-left">Status</th>
              <th class="text-left">Payment</th>
              <th class="text-right">Price</th>
              <th class="text-right pr-6">Amount Paid</th>
              <th class="text-center px-4">Post</th>
              <th class="text-right">Quick Actions</th>
            </tr>
          </thead>
          <tbody id="promos-table-tbody">
            ${fullBodyHtml}
          </tbody>
          <tfoot id="promos-table-tfoot">
            ${footHtml}
          </tfoot>
        </table>
      </div>
    `;
  }

  // Revenue & Cash Flow Overview (Totals and Client Breakdown)
  function renderRevenueOverview() {
    const projects = getProjects();
    const promos = getPromos();

    let totalPaid = 0;
    let totalUnpaid = 0;

    projects.forEach(p => {
      const price = p.budget || p.price || 0;
      const isPaid = isPaidStatus(p.paymentStatus);
      if (isPaid) {
        totalPaid += price;
      } else {
        totalUnpaid += price;
      }
    });

    promos.forEach(pr => {
      const price = pr.price || 0;
      const isPaid = isPaidStatus(pr.paymentStatus);
      if (isPaid) {
        totalPaid += price;
      } else {
        totalUnpaid += price;
      }
    });

    const $totalTracked = document.getElementById('rev-total-tracked');
    const $totalEarned = document.getElementById('rev-total-earned');
    const $projected = document.getElementById('rev-projected-unpaid');
    const $totalCount = document.getElementById('rev-total-count');

    if ($totalTracked) $totalTracked.textContent = `$${(totalPaid + totalUnpaid).toFixed(2)}`;
    if ($totalEarned) $totalEarned.textContent = `$${totalPaid.toFixed(2)}`;
    if ($projected) $projected.textContent = `$${totalUnpaid.toFixed(2)}`;
    if ($totalCount) $totalCount.textContent = `${projects.length + promos.length} Deliverables Logged`;

    // Render combined list of deliverables showing payment status
    const $breakdownList = document.getElementById('revenue-breakdown-list');
    if ($breakdownList) {
      const projectItems = projects.map(p => {
        const price = p.budget || p.price || 0;
        const isPaid = isPaidStatus(p.paymentStatus);
        const status = p.status || 'Not Started';

        return `
          <div class="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/70 border ${!isPaid ? 'border-amber-500/30 bg-amber-950/10' : 'border-slate-800'} text-xs font-mono hover:border-slate-700 transition-colors">
            <div>
              <div class="font-bold text-white flex items-center gap-2">
                <span class="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">Video Edit</span>
                <span>${escapeHtml(p.title)}</span>
              </div>
              <div class="text-slate-400 text-[11px] mt-1 flex items-center gap-2">
                <span class="${status === 'Published' ? 'text-emerald-400' : status === 'In Progress' ? 'text-amber-400' : 'text-rose-400'} font-semibold">${status}</span>
                <span>&bull;</span>
                <span>client: <span class="text-slate-300 font-medium">${escapeHtml(p.clientName || 'Client')}</span></span>
              </div>
            </div>
            <div class="text-right flex items-center gap-3">
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold font-mono ${isPaid ? 'text-emerald-400' : 'text-amber-400'}">$${price.toFixed(2)}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  isPaid 
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40' 
                    : 'bg-amber-950/90 text-amber-300 border border-amber-500/50'
                }">
                  ${isPaid ? 'Paid' : 'Unpaid'}
                </span>
              </div>
              <button onclick="window.flowOpenEditVideo('${p.id}')" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 text-slate-400 text-[11px] transition-colors cursor-pointer" title="Edit video details">
                Edit
              </button>
            </div>
          </div>
        `;
      });

      const promoItems = promos.map(pr => {
        const price = pr.price || 0;
        const isPaid = isPaidStatus(pr.paymentStatus);
        const status = pr.status || 'Not Started';

        return `
          <div class="flex items-center justify-between p-3.5 rounded-xl bg-purple-950/20 border ${!isPaid ? 'border-amber-500/30' : 'border-purple-500/30'} text-xs font-mono hover:border-purple-400/50 transition-colors">
            <div>
              <div class="font-bold text-white flex items-center gap-2">
                <span class="px-1.5 py-0.5 rounded text-[9px] font-mono bg-purple-950 text-purple-300 border border-purple-500/30">Promo Deal</span>
                <span>${escapeHtml(pr.title)}</span>
              </div>
              <div class="text-slate-400 text-[11px] mt-1 flex items-center gap-2">
                <span class="${status === 'Published' ? 'text-emerald-400' : status === 'In Progress' ? 'text-amber-400' : 'text-rose-400'} font-semibold">${status}</span>
                <span>&bull;</span>
                <span>client: <span class="text-purple-300 font-medium">${escapeHtml(pr.clientName || 'Client')}</span></span>
              </div>
            </div>
            <div class="text-right flex items-center gap-3">
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold font-mono ${isPaid ? 'text-emerald-400' : 'text-amber-400'}">$${price.toFixed(2)}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  isPaid 
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40' 
                    : 'bg-amber-950/90 text-amber-300 border border-amber-500/50'
                }">
                  ${isPaid ? 'Paid' : 'Unpaid'}
                </span>
              </div>
              <button onclick="window.flowOpenEditPromo('${pr.id}')" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-purple-950 hover:text-purple-300 text-slate-400 text-[11px] transition-colors cursor-pointer" title="Edit deal details">
                Edit
              </button>
            </div>
          </div>
        `;
      });

      $breakdownList.innerHTML = [...promoItems, ...projectItems].join('');
    }
  }

  // Re-render all tables and metrics across the admin panel
  function renderAll() {
    renderSheetTable();
    renderPromosTable();
    renderRevenueOverview();
  }

  // Helper to escape special characters in user inputs
  const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, m => HTML_ESCAPES[m]);
  }

})();
