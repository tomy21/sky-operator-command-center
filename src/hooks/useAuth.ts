interface LoginRequest {
  identifier: string;
  password: string;
  remember?: boolean;
}

interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  role: string;
  lastActive: string;
  inCall: number;
  createdAt: string;
  updatedAt: string;
}

interface UseUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const LoginAuth = async (loginRequest: LoginRequest) => {
  try {
    const response = await fetch("/api/user/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginRequest),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal login");
    }

    return await response.json();
  } catch (error) {
    console.error("Error login");
    throw error;
  }
};

export const changePassword = async (payload: ChangePasswordRequest) => {
  try {
    const response = await fetch("/api/user/change-password", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal mengubah password");
    }

    return await response.json();
  } catch (error) {
    console.error("Error change password", error);
    throw error;
  }
};

export const getAllUsers = async (params?: UseUsersParams) => {
  try {
    const query = new URLSearchParams({
      page: (params?.page || 1).toString(),
      limit: (params?.limit || 10).toString(),
      search: params?.search || "",
    });

    const response = await fetch(`/api/user?${query.toString()}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal mengambil data user");
    }

    const data = await response.json();
    return data; // data sudah berisi { data: User[], meta: { page, limit, totalItems, totalPages } }
  } catch (error) {
    console.error("Error fetching users", error);
    throw error;
  }
};
