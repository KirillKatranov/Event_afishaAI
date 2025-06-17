import axiosInstance from "@/shared/api/AxiosConfig";
import {AxiosError} from "axios";
import {RegisterOrganizerRequest} from "@/widgets/organizers-auth";

class OrganizersAuthService {
  async organizerRegister(params: { username: string, data: RegisterOrganizerRequest }) {
    try {
      console.log("Send POST register organizer");

      const formData = new FormData();

      formData.append('name', params.data.name);
      formData.append('phone', params.data.phone);
      formData.append('email', params.data.email);
      formData.append('password', params.data.password);

      if (params.data.image) {
        formData.append('image', params.data.image);
      } else {
        formData.append('image', '');
      }

      await axiosInstance.post(
        `/organisations?username=${params.username}`,
        params.data,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        return { error: error.message };
      }
      return { error: "Неизвестная ошибка" }
    }
  };
}

export default new OrganizersAuthService();
