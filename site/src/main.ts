/**
 * Undaunted Knowledge System - Main Application
 *
 * A three-layer knowledge system:
 * 1. Tagged source text
 * 2. Curated entity index
 * 3. Derived wiki/knowledge graph
 */

// Entity type definitions
export type EntityType = 'person' | 'place' | 'event' | 'concept' | 'quote' | 'time';

export interface Entity {
  id: string;
  type: EntityType;
  primary_name: string;
  aliases: string[];
  description: string;
}

export interface Person extends Entity {
  type: 'person';
  born?: string;
  died?: string;
}

export interface Place extends Entity {
  type: 'place';
  coordinates?: [number, number];
}

export interface Event extends Entity {
  type: 'event';
  date?: { gregorian?: string; hebrew?: string };
  place_id?: string;
}

export interface Quote extends Entity {
  type: 'quote';
  speaker?: string;
  text: string;
}

export interface Relationship {
  from: string;
  rel: string;
  to: string;
}

export interface Chapter {
  num: number;
  title: string;
  first: number;
  last: number;
}

export interface Manifest {
  version: string;
  git_sha?: string;
  page_range: [number, number];
  entity_count: number;
  wiki_ids: string[];
}

// App state
interface AppState {
  manifest: Manifest | null;
  entities: Entity[];
  relationships: Relationship[];
  chapters: Chapter[];
  selectedEntity: string | null;
  selectedChapter: number | null;
}

class App {
  private state: AppState = {
    manifest: null,
    entities: [],
    relationships: [],
    chapters: [],
    selectedEntity: null,
    selectedChapter: null
  };

  constructor() {
    this.init();
  }

  private async init() {
    try {
      await this.loadManifest();
      await this.loadEntities();
      await this.loadChapters();
      await this.loadRelationships();
      this.render();
    } catch (error) {
      this.showError('Failed to load data');
      console.error(error);
    }
  }

  private async loadManifest() {
    const response = await fetch('/data/manifest.json');
    if (!response.ok) throw new Error('Failed to load manifest');
    this.state.manifest = await response.json();
  }

  private async loadEntities() {
    const response = await fetch('/data/entities.json');
    if (!response.ok) throw new Error('Failed to load entities');
    this.state.entities = await response.json();
  }

  private async loadChapters() {
    const response = await fetch('/data/chapters.json');
    if (!response.ok) throw new Error('Failed to load chapters');
    this.state.chapters = await response.json();
  }

  private async loadRelationships() {
    const response = await fetch('/data/relationships.json');
    if (!response.ok) throw new Error('Failed to load relationships');
    this.state.relationships = await response.json();
  }

  private showError(message: string) {
    document.getElementById('app')!.innerHTML = `
      <div style="padding: 2rem; color: #8B2635;">
        <h1>Error</h1>
        <p>${message}</p>
      </div>
    `;
  }

  private render() {
    const app = document.getElementById('app')!;

    // Color palette from spec
    const colors = {
      editorial: '#F4EFE5',
      accent: '#8B2635',
      person: '#4A6FA5',
      place: '#8B7355',
      event: '#C45C3E',
      time: '#6B8E4F',
      quote: '#7B6B8E',
      concept: '#A67C52'
    };

    app.innerHTML = `
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: ${colors.editorial};
          color: #1a1a1a;
          line-height: 1.6;
        }
        #app {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
        }
        .pane {
          padding: 2rem;
          overflow-y: auto;
        }
        .source-pane {
          border-right: 1px solid #d0c8bc;
        }
        h1 {
          color: ${colors.accent};
          margin-bottom: 1rem;
        }
        .stats {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 1rem;
        }
        .chapter-list {
          list-style: none;
        }
        .chapter-list li {
          padding: 0.5rem;
          cursor: pointer;
          border-radius: 4px;
        }
        .chapter-list li:hover {
          background: rgba(139, 38, 53, 0.1);
        }
      </style>

      <div class="pane source-pane">
        <h1>Undaunted Knowledge System</h1>
        <p class="stats">
          ${this.state.manifest?.entity_count || 0} entities •
          ${this.state.chapters.length} chapters
        </p>
        <p style="color: #666; font-style: italic;">
          The source pane requires a local build with the PDF corpus.
        </p>
      </div>

      <div class="pane">
        <h2>Chapters</h2>
        <ul class="chapter-list">
          ${this.state.chapters.map(ch => `
            <li>
              <strong>Chapter ${ch.num}</strong>: ${ch.title}
              <br><small>Pages ${ch.first}–${ch.last}</small>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new App());
} else {
  new App();
}
