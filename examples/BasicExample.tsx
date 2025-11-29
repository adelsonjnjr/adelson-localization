import React, { useState } from 'react';
import { useLanguage } from 'adelson-localization';

/**
 * Basic Example - Simple translation with language switching
 */
export default function BasicExample() {
  const { ln, language, setLanguage, loadingResource } = useLanguage({ 
    lang: "en" 
  });

  if (loadingResource) {
    return <div>Loading translations...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>{ln("app.title")}</h1>
      <p>{ln("app.description")}</p>

      <div style={{ marginTop: '20px' }}>
        <h3>Language Selector</h3>
        <select 
          value={language.key} 
          onChange={(e) => setLanguage({ key: e.target.value })}
          style={{ padding: '8px', fontSize: '16px' }}
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="es">Español</option>
        </select>
      </div>

      <div style={{ marginTop: '20px' }}>
        <p><strong>Current Language:</strong> {language.key}</p>
        <p>{ln("greetings.welcome", "John Doe")}</p>
      </div>
    </div>
  );
}
