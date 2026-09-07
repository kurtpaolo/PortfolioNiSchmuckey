/**
 * Freelance Flow - Admin panel controller
 * 
 * Private dashboard to manage my video projects, promotional brand deals, and client revenue.
 * Data is saved in browser localStorage (mirrored from my Google Spreadsheet).
 * 
 * Sections:
 * 1. Video Tracker - tracks video status, pay rate, payment status, raw footage, and youtube links
 * 2. Promos Tracker - tracks sponsorship deals, platforms, deliverables, and rates
 * 3. Revenue & Cash Flow - summary of total earnings, paid vs unpaid balances, and client breakdown
 * 4. Add Project - quick form to add new video projects or promo deals
 */

(function () {
  'use strict';

  // Login credentials (SHA-256 hashes for username "ky" and password "ky")
  const TARGET_USER_HASH = '2076584e3f0868e790b7c97905f0d75a1af62da4f2ee3fba3db40504a686307c';
  const TARGET_PASS_HASH = '2076584e3f0868e790b7c97905f0d75a1af62da4f2ee3fba3db40504a686307c';

  const SESSION_KEY = 'schmuckey_admin_session';
  const PROJECTS_STORAGE_KEY = 'schmuckey_projects_tracker_v1';
  const LEGACY_PROJECTS_STORAGE_KEY = 'bludan_editor_tracker_v3';
  const PROMOS_STORAGE_KEY = 'schmuckey_promos_tracker_v1';

  function isPaidStatus(status) {
    return status === 'Paid' || status === 'Completely Paid';
  }

  // Initial video projects copied from my Google Spreadsheet (12 paid at $12, 7 unpaid at $15)
  const INITIAL_PROJECTS = [
    {
      id: 'vid_01',
      title: 'Bad Customer - Michael',
      clientName: 'bludan',
      service: 'Video Editor',
      price: 12,
      budget: 12,
      paidAmount: 12,
      paymentStatus: 'Paid',
      status: 'Published',
      youtubeLink: 'https://youtube.com/shorts/YIf-bCycNYI',
      rawFilesUrl: 'https://drive.google.com/drive/folders/1evx2DKcVq6m1---AuimukuVUrg7mBQAw',
      createdAt: '2026-08-12'
    },
    {
      id: 'vid_02',
      title: 'Rude Girl At The Grocery',
      clientName: 'bludan',
      service: 'Video Editor',
      price: 12,
      budget: 12,
      paidAmount: 12,
      paymentStatus: 'Paid',
      status: 'Published',
      youtubeLink: 'https://youtube.com/shorts/6OBuvsC492M',
      rawFilesUrl: 'https://drive.google.com/drive/folders/1XR3KKmtElNJcvWS9_YUidWCFgoJPoa5U',
      createdAt: '2026-08-14'
    },
    {
      id: 'vid_03',
      title: 'Hotel Lobby',
      clientName: 'bludan',
      service: 'Video Editor',
      price: 12,
      budget: 12,
      paidAmount: 12,
      paymentStatus: 'Paid',
      status: 'Published',
      youtubeLink: 'https://youtube.com/shorts/sH87GfQFejQ',
      rawFilesUrl: 'https://drive.google.com/file/d/1HDkp9VEiSf2XTpxvKVVu2Yyx9Gqh_P6C/view',
      createdAt: '2026-08-16'
    },
    {
      id: 'vid_04',
      title: 'Plane Story',
      clientName: 'bludan',
      service: 'Video Editor',
      price: 12,
      budget: 12,
      paidAmount: 12,
      paymentStatus: 'Paid',
      status: 'Published',
      youtubeLink: 'https://youtube.com/shorts/4tBL1ovfo0w',
      rawFilesUrl: 'https://drive.google.com/drive/folders/1HIFnCWpEen2Yjuf_-AoD77V35b2xGaKT',
      createdAt: '2026-08-18'
    },
    {
      id: 'vid_05',
      title: "Liam's Story",
      clientName: 'bludan',
      service: 'Video Editor',
      price: 12,
      budget: 12,
      paidAmount: 12,
      paymentStatus: 'Paid',
      status: 'Published',
      youtubeLink: 'https://youtube.com/shorts/J6cNaCOeuaA',
      rawFilesUrl: 'https://drive.google.com/drive/folders/1xOkWRxB609UHX2bpxh5mOo8TkvoYk5RE',
      createdAt: '2026-08-20'
    },
    {
      id: 'vid_06',
      title: 'Biggest Man In The Room',
      clientName: 'bludan',
      service: 'Video Editor',
      price: 12,
      budget: 12,
      paidAmount: 12,
      paymentStatus: 'Paid',
      status: 'Published',
      youtubeLink: 'https://youtube.com/shorts/uWyhdtGFJaw',
      rawFilesUrl: 'https://drive.google.com/drive/folders/1yR1Mhw48ltzfU_9EGLYD2VfhnIzKn7zL',
      createdAt: '2026-08-22'
    },
    {
      id: 'vid_07',
      title: 'Grocery Story',
      clientName: 'bludan',
      service: 'Video Editor',
      price: 12,
      budget: 12,
      paidAmount: 12,
      paymentStatus: 'Paid',
      status: 'Published',
      youtubeLink: 'https://youtube.com/shorts/I5jiuwrGDOk',
      rawFilesUrl: 'https://drive.google.com/file/d/1oN5_oM9civP4iKr5aYJFC0A40mxSId-6/view',
      createdAt: '2026-08-24'
    },
    {
      id: 'vid_08',
      title: 'Cinema Story',
      clientName: 'bludan',
      service: 'Video Editor',
      price: 12,
      budget: 12,
      paidAmount: 12,
      paymentStatus: 'Paid',
      status: 'Published',
      youtubeLink: 'https://youtube.com/shorts/Mnnd3hpsvGs',
      rawFilesUrl: 'https://drive.google.com/file/d/12AcuzC0HKGJEYGL1O31Sm9mTi_4XZmjr/view',
      createdAt: '2026-08-26'
    },
    {
      id: 'vid_09',
      title: 'Supermarket',
      clientName: 'bludan',
      service: 'Video Editor',
      price: 12,
      budget: 12,
      paidAmount: 12,
      paymentStatus: 'Paid',
      status: 'Published',
      youtubeLink: 'https://youtube.com/shorts/aeqoPDfGSYI',
      rawFilesUrl: 'https://drive.google.com/drive/folders/1eWHkdjrtzjDb9SoH1QwFaohR95sQVluG',
      createdAt: '2026-08-28'
    },
    {
      id: 'vid_10',
      title: 'Father & Son Accident',
      clientName: 'bludan',
      service: 'Video Editor',
      price: 12,
      budget: 12,
      paidAmount: 12,
      paymentStatus: 'Paid',
      status: 'Published',
      youtubeLink: 'https://youtube.com/shorts/M6wQoJ8yJTs',
      rawFilesUrl: 'https://drive.google.com/drive/folders/1xaL5Fa2O6VtZR5u0o_9YVrXCBhjFBrXG',
      createdAt: '2026-08-30'
    },
    {
      id: 'vid_11',
      title: "Marcus Doesn't Feel Pain",
      clientName: 'bludan',
      service: 'Video Editor',
      price: 12,
      budget: 12,
      paidAmount: 12,
      paymentStatus: 'Paid',
      status: 'Published',
      youtubeLink: 'https://youtube.com/shorts/O3GNtiAqfGE',
      rawFilesUrl: 'https://drive.google.com/drive/folders/1Q2Js4lgdWZL4LiHAGcAtt2CemDZ9s1FN',
      createdAt: '2026-09-01'
    },
    {
      id: 'vid_12',
      title: 'Elevator Incident',
      clientName: 'bludan',
      service: 'Video Editor',
      price: 12,
      budget: 12,
      paidAmount: 12,
      paymentStatus: 'Paid',
      status: 'Published',
      youtubeLink: 'https://youtube.com/shorts/YzcEz5mKmbQ',
      rawFilesUrl: 'https://drive.google.com/drive/folders/1P6UmPweLPlpGccvzh6WgDvxtWoZDchBL',
      createdAt: '2026-09-02'
    },
    // Unpaid video batch ($15 per video)
    {
      id: 'vid_13',
      title: 'Alex Fear Story',
      clientName: 'bludan',
      service: 'Video Editor',
      price: 15,
      budget: 15,
      paidAmount: 0,
      paymentStatus: 'Unpaid',
      status: 'Published',
      youtubeLink: 'https://youtube.com/shorts/-CZoRBssi2A',
      rawFilesUrl: 'https://drive.google.com/drive/folders/1e4831QZuvRSLNOAoSl6qCeUYavmN63c5?usp=sharing',
      createdAt: '2026-09-03'
    },
    {
      id: 'vid_14',
      title: 'Alex Fear Story Revision',
      clientName: 'bludan',
      service: 'Video Editor',
      price: 15,
      budget: 15,
      paidAmount: 0,
      paymentStatus: 'Unpaid',
      status: 'Published',
      youtubeLink: 'https://youtube.com/shorts/k_E8qSr6knY',
      rawFilesUrl: 'https://drive.google.com/drive/folders/1e4831QZuvRSLNOAoSl6qCeUYavmN63c5?usp=drive_link',
      createdAt: '2026-09-03'
    },
    {
      id: 'vid_15',
      title: 'Noah Time Freeze',
      clientName: 'bludan',
      service: 'Video Editor',
      price: 15,
      budget: 15,
      paidAmount: 0,
      paymentStatus: 'Unpaid',
      status: 'Published',
      youtubeLink: 'https://youtube.com/shorts/M_nHo0ApiW4',
      rawFilesUrl: 'https://drive.google.com/drive/folders/1j9_i_T1S1fmdl7ogZSD4kMdfmlKL4aSq',
      createdAt: '2026-09-04'
    },
    {
      id: 'vid_16',
      title: 'Biggest Man on a Train',
      clientName: 'bludan',
      service: 'Video Editor',
      price: 15,
      budget: 15,
      paidAmount: 0,
      paymentStatus: 'Unpaid',
      status: 'Published',
      youtubeLink: 'https://youtube.com/shorts/L-s3WTuHnyU',
      rawFilesUrl: 'https://drive.google.com/drive/folders/1exCHhqV8c8D-Qhf6FUH9Ch9rQgTR_1qe?usp=sharing',
      createdAt: '2026-09-04'
    },
    {
      id: 'vid_17',
      title: '100 Years of Life',
      clientName: 'bludan',
      service: 'Video Editor',
      price: 15,
      budget: 15,
      paidAmount: 0,
      paymentStatus: 'Unpaid',
      status: 'Published',
      youtubeLink: 'https://youtube.com/shorts/VzZXJ7by03g',
      rawFilesUrl: 'https://drive.google.com/drive/folders/1Y07JxzsiC0r3liPRue0qI9BwY-5q539l',
      createdAt: '2026-09-05'
    },
    {
      id: 'vid_18',
      title: 'Parking Lot',
      clientName: 'bludan',
      service: 'Video Editor',
      price: 15,
      budget: 15,
      paidAmount: 0,
      paymentStatus: 'Unpaid',
      status: 'Published',
      youtubeLink: 'https://youtube.com/shorts/kQQP7NGhXHk',
      rawFilesUrl: 'https://drive.google.com/drive/folders/17-Zo1sbWvOBJNa5v_2XR99MoVCgsgPds?usp=sharing',
      createdAt: '2026-09-05'
    },
    {
      id: 'vid_19',
      title: 'Bridge Incident',
      clientName: 'bludan',
      service: 'Video Editor',
      price: 15,
      budget: 15,
      paidAmount: 0,
      paymentStatus: 'Unpaid',
      status: 'Published',
      youtubeLink: 'https://youtube.com/shorts/wAIOnX3_0XA',
      rawFilesUrl: 'https://drive.google.com/file/d/12NqlpdZ5vqGMeUyYCBUsUvB8U8HQa22t/view',
      createdAt: '2026-09-05'
    }
  ];

  // Helper function to hash text using SHA-256 for login checking
  async function computeSHA256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // LocalStorage helpers for video projects
  function getProjects() {
    let raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!raw) {
      raw = localStorage.getItem(LEGACY_PROJECTS_STORAGE_KEY);
      if (raw) {
        localStorage.setItem(PROJECTS_STORAGE_KEY, raw);
      }
    }
    if (!raw) {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    try {
      const parsed = JSON.parse(raw);
      return parsed.map(p => {
        if (!p.service) p.service = 'Video Editor';
        if (!p.status) p.status = 'Published';
        if (p.price === undefined) p.price = p.budget || 15;
        if (p.budget === undefined) p.budget = p.price;
        return p;
      });
    } catch (e) {
      return INITIAL_PROJECTS;
    }
  }

  function saveProjects(projects) {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  }

  // LocalStorage helpers for promotional deals
  function getPromos() {
    const raw = localStorage.getItem(PROMOS_STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }

  function savePromos(promos) {
    localStorage.setItem(PROMOS_STORAGE_KEY, JSON.stringify(promos));
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
    initSelectPlaceholders();
    setupStrictExit();

    // Update tables if data changes in another open tab
    window.addEventListener('storage', (e) => {
      if (e.key === PROJECTS_STORAGE_KEY || e.key === LEGACY_PROJECTS_STORAGE_KEY || e.key === PROMOS_STORAGE_KEY) {
        renderAll();
      }
    });
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

  // Automatically log out when leaving the page or closing the tab
  function setupStrictExit() {
    window.addEventListener('beforeunload', () => {
      sessionStorage.removeItem(SESSION_KEY);
    });
    window.addEventListener('pagehide', () => {
      sessionStorage.removeItem(SESSION_KEY);
    });

    document.querySelectorAll('.exit-to-portfolio-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem(SESSION_KEY);
        window.location.href = 'index.html';
      });
    });

    document.querySelectorAll('.lock-console-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem(SESSION_KEY);
        showLogin('Console locked. Enter credentials to unlock.', false);
      });
    });
  }

  // Check if user is currently logged in
  function checkSession() {
    const rawSession = sessionStorage.getItem(SESSION_KEY);
    if (!rawSession) {
      showLogin();
      return;
    }
    try {
      const session = JSON.parse(rawSession);
      if (session.userHash === TARGET_USER_HASH) {
        showDashboard();
      } else {
        sessionStorage.removeItem(SESSION_KEY);
        showLogin();
      }
    } catch (e) {
      sessionStorage.removeItem(SESSION_KEY);
      showLogin();
    }
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
    if ($loginUser && !$loginUser.value) $loginUser.focus();
  }

  function showDashboard() {
    if ($loginGate) $loginGate.classList.add('hidden');
    if ($adminApp) $adminApp.classList.remove('hidden');
    renderAll();
  }

  // Handle login form submit
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
        const uHash = await computeSHA256(inputUser);
        const pHash = await computeSHA256(inputPass);

        await new Promise(r => setTimeout(r, 350));

        if (uHash === TARGET_USER_HASH && pHash === TARGET_PASS_HASH) {
          const sessionObj = {
            userHash: uHash,
            timestamp: Date.now(),
            token: 'flf_' + Math.random().toString(36).substring(2)
          };
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionObj));
          showDashboard();
        } else {
          if ($loginGate) {
            $loginGate.classList.add('shake-error');
            setTimeout(() => $loginGate.classList.remove('shake-error'), 500);
          }
          showLogin('Access Denied: Invalid credentials.', true);
        }
      } catch (err) {
        showLogin('Cryptographic error: ' + err.message, true);
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
      $newProjForm.addEventListener('submit', (e) => {
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
          const promos = getPromos();
          promos.push({
            id: 'promo_' + Date.now(),
            title,
            clientName,
            price,
            paidAmount,
            paymentStatus,
            status,
            link: finalUrl || '',
            createdAt: new Date().toISOString().split('T')[0]
          });
          savePromos(promos);
          $newProjForm.reset();
          updateProjectFormService(service);
          renderAll();
          switchTab('panel-promos');
        } else {
          const newVideo = {
            id: 'vid_' + Date.now(),
            title,
            clientName,
            service,
            price,
            budget: price,
            paidAmount,
            paymentStatus,
            status,
            rawFilesUrl: rawUrl || '',
            youtubeLink: finalUrl || '',
            createdAt: new Date().toISOString().split('T')[0]
          };
          const projects = getProjects();
          projects.push(newVideo);
          saveProjects(projects);
          $newProjForm.reset();
          updateProjectFormService(service);
          renderAll();
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
      $videoForm.addEventListener('submit', (e) => {
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

        let projects = getProjects();

        if (editId) {
          const p = projects.find(item => item.id === editId);
          if (p) {
            p.title = title;
            p.clientName = client;
            p.service = service;
            p.status = status;
            p.budget = price;
            p.price = price;
            p.paidAmount = paidAmount;
            p.paymentStatus = paymentStatus;
            p.youtubeLink = link;
            p.rawFilesUrl = raw;
          }
        } else {
          const newVid = {
            id: 'vid_' + Date.now(),
            title,
            clientName: client,
            service,
            budget: price,
            price: price,
            paidAmount: paidAmount,
            paymentStatus: paymentStatus,
            status: status,
            youtubeLink: link,
            rawFilesUrl: raw,
            createdAt: new Date().toISOString().split('T')[0]
          };
          projects.push(newVid);
        }

        saveProjects(projects);
        window.flowCloseVideoModal();
        renderAll();
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
  window.flowCycleStatus = function (id) {
    const projects = getProjects();
    const p = projects.find(item => item.id === id);
    if (!p) return;

    if (!p.status || p.status === 'Not Started' || p.status === "Haven't Started") {
      p.status = 'In Progress';
    } else if (p.status === 'In Progress') {
      p.status = 'Published';
    } else {
      p.status = 'Not Started';
    }

    saveProjects(projects);
    renderAll();
  };

  // Toggle between Paid and Unpaid status
  window.flowTogglePayment = function (id) {
    const projects = getProjects();
    const p = projects.find(item => item.id === id);
    if (!p) return;

    const price = p.budget || p.price || 15;
    if (isPaidStatus(p.paymentStatus)) {
      p.paymentStatus = 'Unpaid';
      p.paidAmount = 0;
    } else {
      p.paymentStatus = 'Paid';
      p.paidAmount = price;
    }
    saveProjects(projects);
    renderAll();
  };

  // Delete video entry after confirmation
  window.flowDeleteProject = function (id) {
    if (confirm('Are you sure you want to remove this video entry?')) {
      let projects = getProjects();
      projects = projects.filter(p => p.id !== id);
      saveProjects(projects);
      renderAll();
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

    const filtered = projects.filter(p => {
      const isPaid = isPaidStatus(p.paymentStatus);
      const status = p.status || 'Not Started';

      if (filter === 'Published' && status !== 'Published') return false;
      if (filter === 'In Progress' && status !== 'In Progress') return false;
      if (filter === 'Not Started' && status !== 'Not Started' && status !== "Haven't Started") return false;
      if (filter === 'Unpaid' && isPaid) return false;
      if (filter === 'Paid' && !isPaid) return false;

      if (projectSearchQuery) {
        const str = `${p.title} ${p.clientName} ${status} ${p.service || ''} ${p.paymentStatus || ''} ${p.youtubeLink || ''}`.toLowerCase();
        if (!str.includes(projectSearchQuery)) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      $container.innerHTML = `
        <div class="p-8 text-center text-slate-500 italic flow-card rounded-2xl">
          No video entries match the current filter or search criteria.
        </div>
      `;
      return;
    }

    // Calculate stats for the pinned metrics bar (Total, Paid, Unpaid)
    let allProjectsPrice = 0;
    let allProjectsPaid = 0;
    let allProjectsUnpaid = 0;

    projects.forEach(p => {
      const price = p.budget || p.price || 0;
      const isPaid = isPaidStatus(p.paymentStatus);
      const paid = isPaid ? price : 0;
      allProjectsPrice += price;
      allProjectsPaid += paid;
      allProjectsUnpaid += isPaid ? 0 : price;
    });

    const $projCount = document.getElementById('project-total-count');
    const $projPaid = document.getElementById('project-paid-amount');
    const $projUnpaid = document.getElementById('project-unpaid-amount');

    if ($projCount) $projCount.textContent = `${projects.length} Videos`;
    if ($projPaid) $projPaid.textContent = `$${allProjectsPaid.toFixed(2)}`;
    if ($projUnpaid) $projUnpaid.textContent = `$${allProjectsUnpaid.toFixed(2)}`;

    let totalTablePrice = 0;
    let totalTablePaid = 0;
    let totalTableUnpaid = 0;

    filtered.forEach(p => {
      const price = p.budget || p.price || 0;
      const isPaid = isPaidStatus(p.paymentStatus);
      const paid = isPaid ? price : 0;
      totalTablePrice += price;
      totalTablePaid += paid;
      totalTableUnpaid += isPaid ? 0 : price;
    });

    const rowsHtml = filtered.map((p, idx) => {
      const isPaid = isPaidStatus(p.paymentStatus);
      const price = p.budget || p.price || 0;
      const paid = isPaid ? price : 0;
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
    }).join('');

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
          <tbody>
            ${rowsHtml}
          </tbody>
          <tfoot>
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
      $promoForm.addEventListener('submit', (e) => {
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

        let promos = getPromos();

        if (editId) {
          const pr = promos.find(item => item.id === editId);
          if (pr) {
            pr.clientName = client;
            pr.title = title;
            pr.price = price;
            pr.status = status;
            pr.paidAmount = paidAmount;
            pr.paymentStatus = paymentStatus;
            pr.link = link;
          }
        } else {
          const newPromo = {
            id: 'promo_' + Date.now(),
            title,
            clientName: client,
            price,
            paidAmount,
            paymentStatus,
            status,
            link,
            createdAt: new Date().toISOString().split('T')[0]
          };
          promos.push(newPromo);
        }

        savePromos(promos);
        window.flowClosePromoModal();
        renderAll();
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
  window.flowPromptPromoLink = function (id) {
    const promos = getPromos();
    const pr = promos.find(item => item.id === id);
    if (!pr) return;
    const currentLink = pr.link || '';
    const newLink = prompt('Enter sponsored post URL once posted:', currentLink);
    if (newLink !== null) {
      pr.link = newLink.trim();
      savePromos(promos);
      renderAll();
    }
  };

  // Cycle promo status (Not Started -> In Progress -> Published)
  window.flowCyclePromoStatus = function (id) {
    const promos = getPromos();
    const pr = promos.find(item => item.id === id);
    if (!pr) return;

    if (!pr.status || pr.status === 'Not Started' || pr.status === "Haven't Started") {
      pr.status = 'In Progress';
    } else if (pr.status === 'In Progress') {
      pr.status = 'Published';
    } else {
      pr.status = 'Not Started';
    }

    savePromos(promos);
    renderAll();
  };

  // Toggle between Paid and Unpaid for promo deals
  window.flowTogglePromoPayment = function (id) {
    const promos = getPromos();
    const pr = promos.find(item => item.id === id);
    if (!pr) return;

    const price = pr.price || 25;
    if (isPaidStatus(pr.paymentStatus)) {
      pr.paymentStatus = 'Unpaid';
      pr.paidAmount = 0;
    } else {
      pr.paymentStatus = 'Paid';
      pr.paidAmount = price;
    }
    savePromos(promos);
    renderAll();
  };

  // Delete promo entry after confirmation
  window.flowDeletePromo = function (id) {
    if (confirm('Are you sure you want to remove this promotional deal?')) {
      let promos = getPromos();
      promos = promos.filter(pr => pr.id !== id);
      savePromos(promos);
      renderAll();
    }
  };

  // Render the promotional deals table
  function renderPromosTable() {
    const $container = document.getElementById('promos-table-container');
    if (!$container) return;

    const promos = getPromos();
    const filter = document.getElementById('promo-status-filter')?.value || 'All';

    // Calculate promo metrics (Total deals, Paid, Unpaid)
    let activePromosCount = 0;
    let promoTotalPaid = 0;
    let promoTotalUnpaid = 0;

    promos.forEach(pr => {
      const price = pr.price || 0;
      const isPaid = isPaidStatus(pr.paymentStatus);
      const paid = isPaid ? price : 0;
      if (pr.status === 'In Progress' || pr.status === 'Not Started') {
        activePromosCount++;
      }
      promoTotalPaid += paid;
      promoTotalUnpaid += isPaid ? 0 : price;
    });

    const $activeCount = document.getElementById('promo-active-count');
    const $paidAmount = document.getElementById('promo-paid-amount');
    const $unpaidAmount = document.getElementById('promo-unpaid-amount');

    if ($activeCount) $activeCount.textContent = `${promos.length} Deals`;
    if ($paidAmount) $paidAmount.textContent = `$${promoTotalPaid.toFixed(2)}`;
    if ($unpaidAmount) $unpaidAmount.textContent = `$${promoTotalUnpaid.toFixed(2)}`;

    // Filter promos based on active dropdown and search query
    const filtered = promos.filter(pr => {
      const isPaid = isPaidStatus(pr.paymentStatus);
      const status = pr.status || 'Not Started';

      if (filter === 'Published' && status !== 'Published') return false;
      if (filter === 'In Progress' && status !== 'In Progress') return false;
      if (filter === 'Not Started' && status !== 'Not Started' && status !== "Haven't Started") return false;
      if (filter === 'Unpaid' && isPaid) return false;
      if (filter === 'Paid' && !isPaid) return false;

      if (promoSearchQuery) {
        const str = `${pr.title} ${pr.clientName} ${status} ${pr.paymentStatus || ''}`.toLowerCase();
        if (!str.includes(promoSearchQuery)) return false;
      }
      return true;
    });

    // Show message if no promo deals are logged yet
    if (promos.length === 0) {
      $container.innerHTML = `
        <div class="flow-card p-10 sm:p-14 rounded-2xl border border-purple-500/25 text-center space-y-3">
          <div class="w-14 h-14 rounded-2xl bg-purple-950/60 border border-purple-500/40 text-purple-400 flex items-center justify-center mx-auto text-xl shadow-lg shadow-purple-500/10">
            <i class="fa-solid fa-bullhorn"></i>
          </div>
          <h3 class="text-lg font-heading font-bold text-white">No Promotional Deals Logged Yet</h3>
          <div class="pt-2">
          </div>
        </div>
      `;
      return;
    }

    if (filtered.length === 0) {
      $container.innerHTML = `
        <div class="p-8 text-center text-slate-500 italic flow-card rounded-2xl">
          No promotional deals match the current filter or search criteria.
        </div>
      `;
      return;
    }

    let tablePrice = 0;
    let tablePaid = 0;
    let tableUnpaid = 0;

    filtered.forEach(pr => {
      const price = pr.price || 0;
      const isPaid = isPaidStatus(pr.paymentStatus);
      const paid = isPaid ? price : 0;
      tablePrice += price;
      tablePaid += paid;
      tableUnpaid += isPaid ? 0 : price;
    });

    const rowsHtml = filtered.map((pr, idx) => {
      const isPaid = isPaidStatus(pr.paymentStatus);
      const price = pr.price || 0;
      const paid = isPaid ? price : 0;
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
    }).join('');

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
          <tbody>
            ${rowsHtml}
          </tbody>
          <tfoot>
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
