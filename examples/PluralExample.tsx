import React, { useState } from 'react';
import { useLanguage } from 'adelson-localization';

/**
 * Plural Example - Demonstrates plural handling for different languages
 */
export default function PluralExample() {
  const { lnPlural, language, setLanguage } = useLanguage({ 
    lang: "en",
    managedLanguages: ["en", "fr", "es", "de", "it"]
  });
  const [messageCount, setMessageCount] = useState(0);
  const [itemCount, setItemCount] = useState(1);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Plural Examples</h2>

      <div style={{ marginBottom: '20px' }}>
        <select 
          value={language.key} 
          onChange={(e) => setLanguage({ key: e.target.value })}
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="es">Español</option>
          <option value="de">Deutsch</option>
          <option value="it">Italiano</option>
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Messages</h3>
        <p>{lnPlural("messages.notification", messageCount)}</p>
        <button onClick={() => setMessageCount(messageCount + 1)}>Add Message</button>
        <button onClick={() => setMessageCount(Math.max(0, messageCount - 1))}>Remove Message</button>
        <button onClick={() => setMessageCount(0)}>Reset</button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Shopping Cart</h3>
        <p>{lnPlural("products.cart", itemCount)}</p>
        <button onClick={() => setItemCount(itemCount + 1)}>Add Item</button>
        <button onClick={() => setItemCount(Math.max(0, itemCount - 1))}>Remove Item</button>
      </div>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f0f0f0' }}>
        <h4>Plural Rules:</h4>
        <ul>
          <li><strong>French (fr):</strong> count ≤ 1 → singular, else plural</li>
          <li><strong>English (en):</strong> count === 1 → singular, else plural</li>
          <li><strong>Spanish (es):</strong> count === 1 → singular, else plural</li>
          <li><strong>German (de):</strong> count === 1 → singular, else plural</li>
          <li><strong>Italian (it):</strong> count === 1 → singular, else plural</li>
        </ul>
        <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#666' }}>
          💡 The hook supports 7 languages out-of-the-box: en, fr, es, de, it, pt, nl
        </p>
      </div>
    </div>
  );
}
