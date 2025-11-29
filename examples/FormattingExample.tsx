import React from 'react';
import { useLanguage } from 'adelson-localization';

/**
 * Formatting Example - Demonstrates indexed and named placeholders
 */
export default function FormattingExample() {
  const { ln } = useLanguage({ lang: "en" });

  return (
    <div style={{ padding: '20px' }}>
      <h2>Formatting Examples</h2>

      <h3>1. Indexed Placeholders</h3>
      <p>{ln("greetings.hello", "Alice")}</p>
      <p>{ln("greetings.time", 14, 30)}</p>

      <h3>2. Named Placeholders</h3>
      <p>{ln("profile.fullName", { firstName: "John", lastName: "Doe" })}</p>
      <p>{ln("profile.info", { firstName: "Marie", lastName: "Curie", age: 28, city: "Paris" })}</p>

      <h3>3. Mix Both</h3>
      <p>{ln("orders.summary", "#12345", { customerName: "Bob", total: 99.99 })}</p>

      <h3>4. Multiple Values</h3>
      <p>{ln("quiz.result", 18, 20, 5, "Expert")}</p>
    </div>
  );
}
