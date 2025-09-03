/* import { LayoutDropdown } from "./LayoutDropdown";

enum SceneOptions {
  Create,
  Open,
  Save,
  Export,
  Import
}

export function CreateSceneOptionsArea(engine: Engine) {
  const dropdown = new LayoutDropdown({
    text: "file",
    dropdownOptions: [
      { text: "Create scene", value: SceneOptions.Create },
      { text: "Open scene", value: SceneOptions.Open },
      { text: "Save scene", value: SceneOptions.Save },
      { text: "Export scene", value: SceneOptions.Export },
      { text: "Import scene", value: SceneOptions.Import }
    ],
    onOptionClick: (option) => {
      switch (option.value) {
        case SceneOptions.Create:
          console.log("Creating a new scene...");
          break;
        case "open":
          console.log("Opening a scene...");
          break;
        case "save":
          console.log("Saving the scene...");
          break;
        case SceneOptions.Export:
          const scene = engine.getScene();
          if (!scene) return;
          scene.serialize();

          break;
        case "import":
          console.log("Importing a scene...");
          break;
        default:
          console.warn("Unknown option selected");
      }
    }
  });

  return dropdown;
}


function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.scene`;


  a.click();

  URL.revokeObjectURL(url);
}
 */