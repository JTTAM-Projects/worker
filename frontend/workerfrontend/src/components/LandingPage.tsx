import React from "react";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <section className="landing">
      <div className="container">
        <div className="banner">
          <h1>Lorem ipsum</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
            odio. Praesent libero. Sed cursus ante dapibus diam.
          </p>
          <div className="banner-buttons">
            <button className="btn-primary">Get started</button>
            <button className="btn-secondary">Learn more</button>
          </div>
        </div>

        <div className="cards">
          {["One", "Two", "Three"].map((k) => (
            <article key={k} className="card">
              <h3>Lorem ipsum {k}</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Curabitur sodales ligula in libero.
              </p>
              <button className="btn-primary small">Action</button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
