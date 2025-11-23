"use client";

import * as React from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";

/**
 * Este cache es CRÍTICO para que SSR y CSR coincidan.
 */
function createEmotionCache() {
  return createCache({ key: "mui", prepend: true });
}

export default function ThemeRegistry({ children }) {
  const cache = React.useMemo(() => {
    const emotionCache = createEmotionCache();

    emotionCache.compat = true; // importante
    return emotionCache;
  }, []);

  // Inserta los estilos SSR en el server BEFORE hydration
  useServerInsertedHTML(() => {
    return (
      <>
        {cache?.sheet?.tags?.map((tag, i) => (
          <style
            key={i}
            data-emotion={`${cache.key} ${tag.getAttribute("data-emotion")}`}
            dangerouslySetInnerHTML={{ __html: tag.innerHTML }}
          />
        ))}
      </>
    );
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
