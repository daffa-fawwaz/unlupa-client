import { useQuery } from "@tanstack/react-query";
import { classroomService } from "../services/classroom.service";

export const useMyClassesTeacher = () => {
  return useQuery({
    queryKey: ["my-classes-teacher"],
    queryFn: classroomService.getMyClassesTeacher,
  });
};
