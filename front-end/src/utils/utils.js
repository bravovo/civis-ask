import { toast } from "sonner";
import { getUserSurveys, getSurveysPassedByUser } from "@/state/profileSlice";
import { getPublishedSurveys } from "@/state/surveysSlice";

export const formatUserFullName = ({ firstName, lastName }) => {
  return `${firstName} ${lastName}`;
};

export async function getDatabaseData(dispatch) {
  try {
    await dispatch(getPublishedSurveys());
    await dispatch(getUserSurveys());
    await dispatch(getSurveysPassedByUser());
  } catch (error) {
    console.error("Error fetching database data:", error);
    toast.error(
      "Помилка отримання актуальних даних. Будь ласка, оновіть сторінку."
    );
  }
}
