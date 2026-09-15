import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SituationList } from "../components/situation/SituationList";
import {
  createCustomScenario,
  deleteCustomScenario,
  listCustomScenarios,
  renameCustomScenario,
} from "../services/checklistStorage";

const availableIcons = [
  "✨",
  "💼",
  "✈️",
  "🎓",
  "🏋️",
  "🏠",
  "💻",
  "⛪",
  "🎯",
  "🧳",
];

export function HomePage() {
  const navigate = useNavigate();
  const [customScenarios, setCustomScenarios] = useState(() =>
    listCustomScenarios(),
  );
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [scenarioName, setScenarioName] = useState("");
  const [scenarioIcon, setScenarioIcon] = useState("✨");
  const [draftItems, setDraftItems] = useState<string[]>([]);
  const [draftItem, setDraftItem] = useState("");
  const [formError, setFormError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const refreshCustomScenarios = () => {
    setCustomScenarios(listCustomScenarios());
  };

  const handleAddDraftItem = () => {
    const trimmedItem = draftItem.trim();

    if (!trimmedItem) {
      return;
    }

    const isDuplicate = draftItems.some(
      (item) => item.trim().toLowerCase() === trimmedItem.toLowerCase(),
    );

    if (isDuplicate) {
      return;
    }

    setDraftItems((currentItems) => [...currentItems, trimmedItem]);
    setDraftItem("");
  };

  const handleCreateScenario = () => {
    const trimmedName = scenarioName.trim();

    if (!trimmedName) {
      setFormError("Checklist name is required.");
      return;
    }

    const hasDuplicateName = customScenarios.some(
      (scenario) =>
        scenario.name.trim().toLowerCase() === trimmedName.toLowerCase(),
    );

    if (hasDuplicateName) {
      setFormError("A checklist with that name already exists.");
      return;
    }

    try {
      const scenario = createCustomScenario({
        name: trimmedName,
        icon: scenarioIcon,
        items: draftItems,
      });

      setCustomScenarios(listCustomScenarios());
      setShowCreateForm(false);
      setScenarioName("");
      setScenarioIcon("✨");
      setDraftItems([]);
      setDraftItem("");
      setFormError("");
      navigate(`/checklist/${scenario.id}`);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    }
  };

  const handleDeleteScenario = (scenarioId: string) => {
    const deleted = deleteCustomScenario(scenarioId);

    if (!deleted) {
      setFormError("Could not delete checklist. Please try again.");
      return;
    }

    setFormError("");
    refreshCustomScenarios();
  };

  const handleRenameScenario = (scenarioId: string) => {
    const trimmedName = editingName.trim();

    if (!trimmedName) {
      return;
    }

    try {
      renameCustomScenario(scenarioId, trimmedName);
      setEditingId(null);
      setEditingName("");
      refreshCustomScenarios();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Could not rename checklist.",
      );
    }
  };

  return (
    <main className="page-shell home-page">
      <header className="hero-section">
        <p className="eyebrow">Did I Forget Something?</p>
        <h1>Before you leave, let&apos;s make sure you have everything.</h1>
      </header>

      <section className="panel" aria-labelledby="suggested-heading">
        <h2 id="suggested-heading">Suggested Scenarios</h2>
        <SituationList
          onSelect={(situationId) => navigate(`/checklist/${situationId}`)}
        />
      </section>

      <section className="panel" aria-labelledby="custom-heading">
        <h2 id="custom-heading">My Checklists</h2>

        {formError ? <p className="form-error">{formError}</p> : null}

        {customScenarios.length === 0 && !showCreateForm ? (
          <div className="empty-state custom-empty-state">
            <p>You haven&apos;t created any checklists yet.</p>
            <p>
              Create a checklist for anything you don&apos;t want to forget.
            </p>
          </div>
        ) : null}

        {customScenarios.length > 0 ? (
          <div className="custom-list">
            {customScenarios.map((scenario) => (
              <div
                key={scenario.id}
                className={`custom-checklist-item${
                  editingId === scenario.id ? " editing" : ""
                }`}
              >
                {editingId === scenario.id ? (
                  <div className="rename-form">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(event) => setEditingName(event.target.value)}
                      aria-label="Rename checklist"
                    />
                    <div className="inline-actions">
                      <button
                        type="button"
                        className="small-button icon-button primary"
                        onClick={() => handleRenameScenario(scenario.id)}
                        aria-label={`Save renamed checklist ${scenario.name}`}
                        title="Save checklist name"
                      >
                        ✓
                      </button>
                      <button
                        type="button"
                        className="small-button icon-button secondary"
                        onClick={() => {
                          setEditingId(null);
                          setEditingName("");
                          setFormError("");
                        }}
                        aria-label={`Cancel renaming ${scenario.name}`}
                        title="Cancel rename"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      className="custom-scenario-button"
                      onClick={() => navigate(`/checklist/${scenario.id}`)}
                    >
                      <span aria-hidden="true">{scenario.icon}</span>
                      <span>{scenario.name}</span>
                    </button>

                    <div className="custom-actions">
                      <button
                        type="button"
                        className="small-button icon-button secondary"
                        onClick={() => {
                          setEditingId(scenario.id);
                          setEditingName(scenario.name);
                          setFormError("");
                        }}
                        aria-label={`Rename checklist ${scenario.name}`}
                        title="Rename checklist"
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        className="small-button icon-button danger"
                        onClick={() => handleDeleteScenario(scenario.id)}
                        aria-label={`Delete checklist ${scenario.name}`}
                        title="Delete checklist"
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : null}

        {showCreateForm ? (
          <div className="create-form">
            <label className="field-label" htmlFor="custom-name">
              What are you preparing for?
            </label>
            <input
              id="custom-name"
              type="text"
              value={scenarioName}
              onChange={(event) => {
                setScenarioName(event.target.value);
                if (formError) {
                  setFormError("");
                }
              }}
              placeholder="Job Interview"
            />

            <label className="field-label" htmlFor="custom-icon">
              Icon
            </label>
            <div className="icon-selector" id="custom-icon">
              {availableIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  aria-label={`Use ${icon} icon`}
                  className={
                    icon === scenarioIcon ? "icon-option active" : "icon-option"
                  }
                  onClick={() => setScenarioIcon(icon)}
                >
                  {icon}
                </button>
              ))}
            </div>

            <label className="field-label" htmlFor="draft-item">
              Add initial items (optional)
            </label>
            <div className="draft-item-row">
              <input
                id="draft-item"
                type="text"
                value={draftItem}
                onChange={(event) => setDraftItem(event.target.value)}
                placeholder="Resume"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleAddDraftItem();
                  }
                }}
              />
              <button
                type="button"
                className="small-button primary"
                onClick={handleAddDraftItem}
              >
                Add
              </button>
            </div>

            {draftItems.length > 0 ? (
              <div className="draft-item-list">
                {draftItems.map((item, index) => (
                  <div key={`${item}-${index}`} className="draft-item-pill">
                    <span>{item}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${item}`}
                      onClick={() =>
                        setDraftItems((currentItems) =>
                          currentItems.filter(
                            (_, itemIndex) => itemIndex !== index,
                          ),
                        )
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="inline-actions">
              <button
                type="button"
                className="primary-button"
                onClick={handleCreateScenario}
              >
                Create
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setShowCreateForm(false);
                  setScenarioName("");
                  setScenarioIcon("✨");
                  setDraftItems([]);
                  setDraftItem("");
                  setFormError("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="primary-button create-checklist-button"
            onClick={() => setShowCreateForm(true)}
          >
            + Create New Checklist
          </button>
        )}
      </section>
    </main>
  );
}
