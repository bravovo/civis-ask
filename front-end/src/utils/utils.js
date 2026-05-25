import { toast } from "sonner";
import { getUserSurveys, getSurveysPassedByUser } from "@/state/profileSlice";
import { getPublishedSurveys } from "@/state/surveysSlice";

export const formatUserFullName = ({ firstName, lastName }) => {
  return `${firstName} ${lastName}`;
};

export async function getDatabaseData(dispatch) {
  try {
    await Promise.all([
      dispatch(getPublishedSurveys()).unwrap(),
      dispatch(getUserSurveys()).unwrap(),
      dispatch(getSurveysPassedByUser()).unwrap(),
    ]);
  } catch (error) {
    toast.error(
      "Помилка отримання актуальних даних. Будь ласка, оновіть сторінку."
    );
  }
}
