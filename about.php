<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Schmuckey · About Me</title>
  <meta name="description" content="About Schmuckey - Content Creator, Video Editor & Tech Explorer. Experienced editor for top creators like bludan (14M+ views).">
  <meta name="theme-color" content="#0b0f19">
  
  <!-- Google Fonts: Inter & Outfit -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  
  <!-- FontAwesome 6 Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  
  <!-- Tailwind CSS via CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              cyan: '#06b6d4',
              cyanLight: '#22d3ee',
              blue: '#2563eb',
              blueDark: '#1d4ed8',
              slateBg: '#0b0f19',
              slateCard: '#0f172a',
            }
          },
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            heading: ['Outfit', 'sans-serif'],
          }
        }
      }
    }
  </script>

  <!-- Custom CSS -->
  <link rel="stylesheet" href="css/style.css">
</head>
<body class="bg-[#0b0f19] text-slate-100 antialiased selection:bg-cyan-500 selection:text-black">

  <!-- Glow blobs in the background (clipped so mobile screens don't get weird horizontal scroll) -->
  <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div class="ambient-glow-cyan top-[-100px] left-[-80px]"></div>
    <div class="ambient-glow-blue top-[400px] right-[-100px]"></div>
  </div>

  <!-- Top navigation bar -->
  <header class="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0b0f19]/90 border-b border-cyan-500/20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        
        <!-- Brand Logo -->
        <a href="index.php" class="flex items-center gap-3 group">
          <div class="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform duration-300">
            <i class="fa-solid fa-play text-white text-lg ml-0.5 group-hover:rotate-12 transition-transform"></i>
          </div>
          <div class="flex flex-col text-left">
            <span class="font-heading font-black text-[21.75px] tracking-wide text-white leading-none">schmuck<span class="gradient-text">ey</span></span>
            <span class="text-[12px] font-semibold text-cyan-400 mt-1 leading-none tracking-normal select-none">&quot;i miss you, be well&quot;</span>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="index.php" class="text-slate-300 hover:text-cyan-400 transition-colors duration-200">Home</a>
          <a href="services.php" class="text-slate-300 hover:text-cyan-400 transition-colors duration-200">Services</a>
          <a href="about.php" class="text-cyan-400 font-semibold transition-colors duration-200">About</a>
          <a href="contact.php" class="text-slate-300 hover:text-cyan-400 transition-colors duration-200">Contact</a>
        </nav>

        <!-- App link and Discord button -->
        <div class="hidden md:flex items-center gap-3">
          <!-- Temporarily hidden for job application
          <a href="app.php" class="text-xs text-slate-300 hover:text-cyan-300 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 hover:border-cyan-500/40">
            <i class="fa-solid fa-layer-group text-[11px] text-cyan-400"></i>
            <span>My App</span>
          </a>
          -->
          <a href="contact.php" class="gradient-btn px-4 py-2 rounded-xl text-sm font-bold text-white shadow-lg flex items-center gap-2">
            <i class="fa-brands fa-discord text-base"></i>
            <span>schmuck404</span>
          </a>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <button id="mobile-menu-btn" type="button" class="p-2 rounded-lg bg-slate-900 border border-cyan-500/30 text-slate-300 hover:text-cyan-400 focus:outline-none" aria-label="Toggle menu">
            <i id="menu-icon-open" class="fa-solid fa-bars text-xl"></i>
            <i id="menu-icon-close" class="fa-solid fa-xmark text-xl hidden"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Dropdown Menu -->
    <div id="mobile-nav-menu" class="hidden md:hidden bg-slate-900/95 border-b border-cyan-500/20 px-4 pt-2 pb-6 space-y-3 max-h-[calc(100vh-5rem)] overflow-y-auto">
      <a href="index.php" class="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60">Home</a>
      <a href="services.php" class="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60">Services</a>
      <a href="about.php" class="block px-3 py-2 rounded-md text-base font-semibold text-cyan-400 bg-cyan-950/40 border-l-2 border-cyan-400">About</a>
      <a href="contact.php" class="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60">Contact</a>
      <div class="pt-3 border-t border-slate-800 flex flex-col gap-2">
        <!-- Temporarily hidden for job application
        <a href="app.php" class="text-center py-2 px-3 rounded-lg bg-slate-800/80 border border-slate-700/60 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-cyan-300 flex items-center justify-center gap-1.5 font-medium">
          <i class="fa-solid fa-layer-group text-[11px] text-cyan-400"></i>
          <span>My App</span>
        </a>
        -->
        <a href="contact.php" class="gradient-btn text-center py-2.5 rounded-lg text-sm font-semibold text-white">
          <i class="fa-brands fa-discord mr-2"></i>Discord: schmuck404
        </a>
      </div>
    </div>
  </header>

  <main>
    <!-- Bio and profile hero section -->
    <section class="py-12 md:py-20">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Top section pill badge -->
        <div class="text-center mb-8 sm:mb-12">
          <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider shadow-sm">
            <i class="fa-solid fa-user-astronaut text-cyan-400"></i>
            <span>About Me</span>
          </span>
        </div>

        <!-- 2-column layout so socials sit on the left and my bio sits on the right -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          <!-- Left side: TikTok and Instagram cards -->
          <div class="lg:col-span-5 flex flex-col gap-6 justify-between order-2 lg:order-1">
            
            <!-- TikTok profile card -->
            <div class="glass-card rounded-2xl p-4 sm:p-5 border border-cyan-500/30 shadow-xl flex flex-col justify-between group hover:border-cyan-400/50 transition-all duration-300">
              <div>
                <div class="flex items-center justify-between mb-3.5">
                  <div class="flex items-center gap-2.5">
                    <span class="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center justify-center text-sm">
                      <i class="fa-brands fa-tiktok"></i>
                    </span>
                    <div>
                      <h3 class="font-heading font-bold text-white text-sm">TikTok</h3>
                      <p class="text-[11px] text-slate-400 font-mono">@schmuck.ey</p>
                    </div>
                  </div>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950/70 text-cyan-300 border border-cyan-500/30">Inactive</span>
                </div>

                <a href="https://www.tiktok.com/@schmuck.ey" target="_blank" rel="noopener noreferrer" class="block rounded-xl overflow-hidden border border-cyan-500/20 bg-slate-950 hover:border-cyan-400 transition-colors group/img" title="Visit @schmuck.ey on TikTok">
                  <img src="assets/images/image01.jpg" alt="Schmuckey TikTok Channel" loading="lazy" decoding="async" class="w-full h-auto object-contain block rounded-xl group-hover/img:scale-[1.02] transition-transform duration-300">
                </a>
              </div>

              <div class="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div class="flex items-center gap-1.5 text-slate-400">
                  <i class="fa-brands fa-discord text-cyan-400"></i>
                  <a href="https://www.tiktok.com/@schmuck.ey" target="_blank" rel="noopener noreferrer" class="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
                  <span>Visit Profile</span>
                  <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                </a>
                </div>
              </div>
            </div>

            <!-- Instagram card with my profile info and pfp -->
            <div class="glass-card rounded-2xl p-4 sm:p-5 border border-pink-500/30 shadow-xl flex flex-col justify-between group hover:border-pink-400/50 transition-all duration-300">
              <div>
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2.5">
                    <span class="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 flex items-center justify-center text-sm">
                      <i class="fa-brands fa-instagram"></i>
                    </span>
                    <div>
                      <h3 class="font-heading font-bold text-white text-sm">Instagram</h3>
                      <a href="https://www.instagram.com/schmuckeyy/" target="_blank" rel="noopener noreferrer" class="text-[11px] text-pink-300 font-mono hover:underline">@schmuckeyy</a>
                    </div>
                  </div>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-mono bg-pink-950/70 text-pink-300 border border-pink-500/30">Inactive</span>
                </div>

                <!-- Instagram Profile Card -->
                <div class="rounded-xl border border-pink-500/20 bg-slate-950/70 p-3.5 sm:p-4">
                  <div class="flex items-center gap-3 sm:gap-4">
                    <div class="relative flex-shrink-0">
                      <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-md shadow-pink-500/20">
                        <img src="assets/images/zukohead.jpeg" alt="pao (@schmuckeyy)" class="w-full h-full rounded-full object-cover border-2 border-slate-950">
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-1.5">
                        <h4 class="font-bold text-white text-base leading-tight">schmuckeyy</h4>
                      </div>
                      <p class="text-xs text-slate-400 font-medium">pao</p>
                      <div class="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1.5 text-[11px] text-slate-300">
                        <span><strong class="text-white font-semibold">1</strong> post</span>
                        <span><strong class="text-white font-semibold">50</strong> followers</span>
                        <span><strong class="text-white font-semibold">50</strong> following</span>
                      </div>
                    </div>
                  </div>

                  <div class="mt-3.5 pt-3 border-t border-slate-800/80 text-xs">
                    <p class="text-slate-300 italic font-medium">he really hates the rain.</p>
                    <a href="https://schmuckey.carrd.co" target="_blank" rel="noopener noreferrer" class="mt-1.5 text-[11px] text-cyan-400 hover:underline flex items-center gap-1">
                      <i class="fa-solid fa-link text-[10px]"></i>
                      <span>schmuckey.carrd.co</span>
                    </a>
                  </div>
                </div>
              </div>

              <div class="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div class="flex items-center gap-1.5 text-slate-400">
                  <i class="fa-brands fa-instagram text-pink-400"></i>
                  <a href="https://www.instagram.com/schmuckeyy/" target="_blank" rel="noopener noreferrer" class="font-semibold text-pink-400 hover:text-pink-300 transition-colors flex items-center gap-1">
                  <span>View Profile</span>
                  <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                </a>
                </div>
              </div>
            </div>

          </div>

          <!-- Right side: Title headline, bio card, and Carrd link -->
          <div class="lg:col-span-7 flex flex-col gap-6 justify-between order-1 lg:order-2">
            
            <!-- Main heading -->
            <div class="pt-1">
              <h1 class="font-heading font-black text-3xl sm:text-5xl text-white leading-tight">
                here's a little bit about <span class="gradient-text">me</span>.
              </h1>
            </div>

            <!-- My personal bio and background info -->
            <div class="glass-card rounded-2xl p-5 sm:p-7 border border-cyan-500/30 shadow-xl flex-1 flex flex-col justify-between relative overflow-hidden">
              <div class="space-y-4">
                <div class="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <span class="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center justify-center text-sm flex-shrink-0">
                      <i class="fa-solid fa-user"></i>
                    </span>
                    <div class="min-w-0">
                      <h2 class="font-heading font-black text-lg sm:text-xl text-white">who am i?</h2>
                      <p class="text-[11px] text-slate-400 font-mono truncate sm:overflow-visible">Kurt Paolo D. Redondo &bull; Schmuckey</p>
                    </div>
                  </div>
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 flex-shrink-0">Video Editor &bull; Content Creator</span>
                </div>

                <p class="text-slate-300 text-sm leading-relaxed text-justify">
                  I'm <strong>Kurt Paolo D. Redondo</strong>, 20 years old and based in <strong>Malaban, Biñan, Laguna</strong>. I am a freelance <strong>Video Editor</strong> and <strong>Content Creator</strong>.
                </p>

                <p class="text-slate-300 text-sm leading-relaxed text-justify">
                  Architecture was originally the plan, but I found my true passion in content creation and video editing. I’ve been a creator and an editor for around two years now, mostly working on gaming content and short-form stuff. I like clipping, recording whatever it is that i think is cool or funny and turning it into something that actually feels good to watch.
                </p>

                <p class="text-slate-400 text-xs sm:text-sm leading-relaxed text-justify">
                  Outside of work and editing, I spend most of my time gaming. I play games like <strong>Valorant</strong> and <strong>Wuthering Waves</strong>. I also draw, and read books when I'm really bored.
                </p>
              </div>

              <div class="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <a href="https://youtu.be/PvQh6Fe7b_g" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:text-cyan-300 transition-colors inline-flex flex-wrap items-center gap-1.5 font-semibold">
                  <i class="fa-brands fa-youtube text-red-500 text-sm"></i>
                  <span>Short Video Introduction About Me</span>
                  <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                </a>
              </div>
            </div>

            <!-- Quick link back to my original Carrd portfolio -->
            <div class="glass-card rounded-2xl p-4 sm:p-5 border border-cyan-500/30 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div class="flex items-center gap-3 text-left">
                <div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-lg flex-shrink-0">
                  <i class="fa-solid fa-globe"></i>
                </div>
                <div class="min-w-0">
                  <h4 class="font-heading font-bold text-white text-sm">Reference Portfolio</h4>
                  <p class="text-xs text-slate-400">View my original portfolio used as reference for this website.</p>
                </div>
              </div>
              <a href="https://schmuckey.carrd.co" target="_blank" rel="noopener noreferrer" class="gradient-btn w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-md hover:shadow-cyan-500/20 transition-all flex-shrink-0">
                <span>Visit Carrd</span>
                <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>

    <!-- Editing software and tools I use -->
    <section class="py-16 bg-slate-950/60 border-y border-cyan-500/10">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center max-w-3xl mx-auto mb-12">
          <h2 class="font-heading font-black text-2xl sm:text-4xl text-white uppercase">
            Software I <span class="gradient-text">Use</span>
          </h2>
          <p class="text-slate-400 text-sm mt-2">
            The core creative suite and production tools powering my editing workflow.
          </p>
        </div>

        <div class="auto-center-grid-3">
          <div class="auto-center-item-3 glass-card p-6 rounded-2xl border border-cyan-500/20 text-center flex flex-col items-center">
            <div class="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xl mb-4 border border-cyan-500/30">
              <i class="fa-solid fa-film"></i>
            </div>
            <h3 class="font-heading font-bold text-lg text-white mb-1">DaVinci Resolve</h3>
            <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 mb-3">Editing & Color</span>
            <p class="text-xs text-slate-300 leading-relaxed">
              My main editor for cutting, color grading, audio, and overall video production.
            </p>
          </div>

          <div class="auto-center-item-3 glass-card p-6 rounded-2xl border border-blue-500/20 text-center flex flex-col items-center">
            <div class="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl mb-4 border border-blue-500/30">
              <i class="fa-solid fa-scissors"></i>
            </div>
            <h3 class="font-heading font-bold text-lg text-white mb-1">CapCut</h3>
            <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-950/70 text-blue-300 border border-blue-500/30 mb-3">Short-Form Editing</span>
            <p class="text-xs text-slate-300 leading-relaxed">
              For Shorts, TikToks, Reels, quick cuts, captions, zooms, and fast-paced edits.
            </p>
          </div>

          <div class="auto-center-item-3 glass-card p-6 rounded-2xl border border-purple-500/20 text-center flex flex-col items-center">
            <div class="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-xl mb-4 border border-purple-500/30">
              <i class="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <h3 class="font-heading font-bold text-lg text-white mb-1">Topaz AI</h3>
            <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-purple-950/70 text-purple-300 border border-purple-500/30 mb-3">Upscaling & Enhancement</span>
            <p class="text-xs text-slate-300 leading-relaxed">
              For cleaning up footage, upscaling, denoising, and making clips look sharper.
            </p>
          </div>
        </div>

      </div>
    </section>

    <!-- Contact CTA at the bottom -->
    <section class="py-20 text-center">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="font-heading font-black text-3xl sm:text-4xl text-white">
          Let's Build Something Memorable
        </h2>
        <p class="text-slate-300 text-sm mt-3 mb-6 leading-relaxed">
          I'm always open to new projects, collaborations, and editing gigs.
        </p>
        <a href="contact.php" class="gradient-btn w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-xl font-bold text-white inline-flex items-center justify-center gap-2 shadow-lg">
          <i class="fa-brands fa-discord"></i>
          <span>Contact Me</span>
        </a>
      </div>
    </section>
  </main>

  <!-- Footer section -->
  <footer class="bg-slate-950 border-t border-slate-900 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400 text-center md:text-left">
      <div class="flex items-center gap-3">
        <span class="font-heading font-black text-lg text-white">
          SCHMUCK<span class="gradient-text">EY</span>
        </span>
        <span class="text-slate-600">&bull;</span>
        <span>Content Creator & Video Editor</span>
      </div>

      <div class="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        <a href="index.php" class="hover:text-cyan-300 transition-colors">Home</a>
        <a href="services.php" class="hover:text-cyan-300 transition-colors">Services</a>
        <a href="about.php" class="text-cyan-400 font-semibold">About</a>
        <a href="contact.php" class="hover:text-cyan-300 transition-colors">Contact</a>
        <a href="https://schmuckey.carrd.co" target="_blank" rel="noopener noreferrer" class="hover:text-cyan-300 transition-colors">Carrd</a>
      </div>

      <div class="text-slate-500 flex flex-wrap items-center justify-center gap-3">
        <span>&copy; <span class="current-year"></span> Schmuckey. All rights reserved.</span>
      </div>
    </div>
  </footer>

  <!-- Back to Top Button -->
  <button id="back-to-top" aria-label="Back to top" class="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-black border border-cyan-500/40 flex items-center justify-center opacity-0 pointer-events-none transition-all shadow-lg">
    <i class="fa-solid fa-arrow-up text-sm"></i>
  </button>

  <!-- jQuery 3.7.1 -->
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <!-- Main Script -->
  <script src="js/main.js"></script>
</body>
</html>
