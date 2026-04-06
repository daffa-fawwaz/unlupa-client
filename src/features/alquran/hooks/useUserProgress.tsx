import { useCallback, useEffect, useState } from "react";
import { alquranService } from "@/features/alquran/services/alquran.services";

export const useUserProgress = () => {
  const [completedJuz, setCompletedJuz] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProgress = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await alquranService.getUserProgress();
      setCompletedJuz(response.data.completed_juz || []);
    } catch (err: unknown) {
      // Fallback to localStorage if API fails
      const saved = localStorage.getItem("alquran:completedJuz");
      if (saved) {
        try {
          setCompletedJuz(JSON.parse(saved));
        } catch {
          setCompletedJuz([]);
        }
      } else {
        setCompletedJuz([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const saveUserProgress = useCallback(async (newCompletedJuz: number[]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await alquranService.saveUserProgress({
        completed_juz: newCompletedJuz,
      });
      setCompletedJuz(response.data.completed_juz || []);
      return true;
    } catch (err: unknown) {
      // Fallback to localStorage if API fails
      localStorage.setItem("alquran:completedJuz", JSON.stringify(newCompletedJuz));
      setCompletedJuz(newCompletedJuz);
      return true; // Return true even on API error because localStorage worked
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleJuzCompleted = useCallback(async (juzNumber: number, completed: boolean) => {
    const newCompletedJuz = completed
      ? [...completedJuz, juzNumber]
      : completedJuz.filter((j) => j !== juzNumber);
    
    const success = await saveUserProgress(newCompletedJuz);
    return success;
  }, [completedJuz, saveUserProgress]);

  useEffect(() => {
    void fetchUserProgress();
  }, [fetchUserProgress]);

  return {
    completedJuz,
    loading,
    error,
    fetchUserProgress,
    saveUserProgress,
    toggleJuzCompleted,
  };
};
