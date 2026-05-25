import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { classroomService } from "../services/classroom.service";

// Hook to fetch teacher's classes
export const useMyClassesTeacher = () => {
  return useQuery({
    queryKey: ["my-classes-teacher"],
    queryFn: classroomService.getMyClassesTeacher,
  });
};

// Hook to create a new class (for teacher)
export const useCreateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: classroomService.createClass,
    onSuccess: () => {
      // Invalidate and refetch the classes after creating a new one
      queryClient.invalidateQueries({ queryKey: ["my-classes-teacher"] });
    },
  });
};
