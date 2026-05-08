import { useEffect } from "react";

const YANDEX_METRIKA_COUNTER_ID = 109026665;
const YANDEX_METRIKA_SCRIPT_ID = "yandex-metrika-counter";

export const useYandexMetrika = () => {
  useEffect(() => {
    if (!document.getElementById(YANDEX_METRIKA_SCRIPT_ID)) {
      const script = document.createElement("script");

      script.id = YANDEX_METRIKA_SCRIPT_ID;
      script.type = "text/javascript";
      script.textContent = `
        (function(m,e,t,r,i,k,a){
          m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
        })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRIKA_COUNTER_ID}', 'ym');

        ym(${YANDEX_METRIKA_COUNTER_ID}, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
      `;

      document.head.insertBefore(script, document.head.firstChild);
    }

    return () => {
      document.getElementById(YANDEX_METRIKA_SCRIPT_ID)?.remove();
    };
  }, []);
};

export const YANDEX_METRIKA_NOSCRIPT_ID = "yandex-metrika-noscript";
export const YANDEX_METRIKA_WATCH_URL =
  `https://mc.yandex.ru/watch/${YANDEX_METRIKA_COUNTER_ID}`;
