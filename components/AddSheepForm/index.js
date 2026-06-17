import { StyledButton } from "../Global/Global.styled";
export default function AddSheepForm() {
  return (
    <form>
      <label htmlFor="sheepName"> Name your sheep</label>
      <input name="sheepName" id="sheepName" />
      <button> create</button>
    </form>
  );
}
