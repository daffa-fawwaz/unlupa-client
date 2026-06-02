import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { classroomService } from "../services/classroom.service";
import type { UpdateClassPayload } from "../types";

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

// Hook to update a class (for teacher)
export const useUpdateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { classId: string; payload: UpdateClassPayload }) =>
      classroomService.updateClass(payload.classId, payload.payload),
    onSuccess: () => {
      // Invalidate and refetch the classes after updating a class
      queryClient.invalidateQueries({ queryKey: ["my-classes-teacher"] });
    },
  });
};

// Hook to delete a class (for teacher)
export const useDeleteClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (classId: string) => classroomService.deleteClass(classId),
    onSuccess: () => {
      // Invalidate and refetch the classes after deleting a class
      queryClient.invalidateQueries({ queryKey: ["my-classes-teacher"] });
    },
  });
};
