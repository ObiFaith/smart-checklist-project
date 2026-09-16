import { useState } from "react";
import type { FormEvent } from "react";

type AddItemFormProps = {
  onAddItem: (name: string) => boolean;
};

export function AddItemForm({ onAddItem }: AddItemFormProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setError("Please enter an item.");
      return;
    }

    const added = onAddItem(trimmedValue);

    if (!added) {
      setError("That item is already in your checklist.");
      return;
    }

    setValue("");
    setError("");
  };

  return (
    <form className="add-item-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="new-item" className="sr-only">
        Add a checklist item
      </label>
      {error ? (
        <p id="add-item-error" className="form-error" role="alert">
          {error}
        </p>
      ) : null}
      <input
        id="new-item"
        type="text"
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          if (error) {
            setError("");
          }
        }}
        placeholder="Add something"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "add-item-error" : undefined}
      />
      <button type="submit" className="primary-button">
        + Add Item
      </button>
    </form>
  );
}
