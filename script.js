/* ============================================================
   Odbrojavanje do: 17.12.2026. 20:00 (Europe/Zagreb, zimi UTC+1)
   Ciljni trenutak je fiksiran u UTC-u kako bi odbrojavanje bilo
   ispravno bez obzira na vremensku zonu uredaja.
   ============================================================ */

(function () {
  "use strict";

  var TARGET = new Date("2026-12-17T19:00:00Z").getTime();

  var els = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds"),
    countdown: document.getElementById("countdown"),
    liftoff: document.getElementById("liftoff"),
    srStatus: document.getElementById("countdown-sr")
  };

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var timerId = null;
  var lastSrMinute = null;

  function pad(n, size) {
    var s = String(n);
    while (s.length < size) {
      s = "0" + s;
    }
    return s;
  }

  function setValue(el, next) {
    if (el.textContent === next) {
      return;
    }
    el.textContent = next;

    if (reduceMotion) {
      return;
    }
    el.classList.remove("tick");
    // reflow kako bi se animacija mogla ponovno pokrenuti
    void el.offsetWidth;
    el.classList.add("tick");
  }

  // Jezicno ispravna hrvatska mnozina (1 dan, 2 dana, 5 dana ...)
  function plural(n, one, few, many) {
    var mod100 = n % 100;
    var mod10 = n % 10;

    if (mod10 === 1 && mod100 !== 11) {
      return one;
    }
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
      return few;
    }
    return many;
  }

  function announce(d, h, m) {
    if (!els.srStatus || lastSrMinute === m) {
      return;
    }
    lastSrMinute = m;
    els.srStatus.textContent =
      "Još " +
      d + " " + plural(d, "dan", "dana", "dana") + ", " +
      h + " " + plural(h, "sat", "sata", "sati") + " i " +
      m + " " + plural(m, "minuta", "minute", "minuta") +
      " do početka filma.";
  }

  function showLiftoff() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
    if (els.countdown) {
      els.countdown.hidden = true;
    }
    if (els.liftoff) {
      els.liftoff.hidden = false;
    }
    if (els.srStatus) {
      els.srStatus.textContent = "Film je počeo.";
    }
    document.title = "Film je počeo — Avengers: Doomsday";
  }

  function render() {
    var diff = TARGET - Date.now();

    if (diff <= 0) {
      showLiftoff();
      return;
    }

    var totalSeconds = Math.floor(diff / 1000);
    var days = Math.floor(totalSeconds / 86400);
    var hours = Math.floor((totalSeconds % 86400) / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;

    setValue(els.days, String(days));
    setValue(els.hours, pad(hours, 2));
    setValue(els.minutes, pad(minutes, 2));
    setValue(els.seconds, pad(seconds, 2));

    announce(days, hours, minutes);
  }

  render();
  timerId = setInterval(render, 1000);

  // Nakon vracanja u tab odmah osvjezi prikaz
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      render();
    }
  });
})();
