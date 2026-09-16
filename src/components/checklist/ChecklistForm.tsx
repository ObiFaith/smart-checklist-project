import { useState } from "react";
import { useNavigate } from "react-router";
import { availableIcons } from "../../data/availableIcons";
import { createCustomScenario, listCustomScenarios } from "../../services/checklistStorage";

export function ChecklistForm() {
  const navigate = useNavigate();
  const [draftItem, setDraftItem] = useState("");
  const [formError, setFormError] = useState("");
  const [scenarioName, setScenarioName] = useState("");
  const [scenarioIcon, setScenarioIcon] = useState("✨");
  const [draftItems, setDraftItems] = useState<string[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [customScenarios, setCustomScenarios] = useState(() =>
    listCustomScenarios(),
  );

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

  return (
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
                    currentItems.filter((_, itemIndex) => itemIndex !== index),
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
  );
}
