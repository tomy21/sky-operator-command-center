export interface Issue {
  id: number;
  ticket: string;
  category: string;
  lokasi: string;
  description: string;
  gate: string;
  action: string;
  foto_lpr: string;
  foto_face: string;
  number_plate: string;
  duration: string;
  TrxNo: string;
  solusi: string;
  status: string;
  foto_bukti_pembayaran: string;
  createdBy: string;
  modifiedBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
}

interface IssueResponse {
  code: number;
  message: string;
  data: Issue[];
  meta?: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}

interface IssueMonthly {
  month: string;
  total: number;
}
interface IssueMonthlyResponse {
  status: string;
  data: IssueMonthly[];
}

interface IssueDetailResponse {
  code: number;
  message: string;
  data: Issue;
}

export const fetchIssues = async (
  page = 1,
  limit = 5,
  search = "",
  date = "",
  location = ""
) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) params.append("search", search);
    if (date) params.append("date", date);
    if (location) params.append("location", location);

    const response = await fetch(`/api/issue/get-all?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data: IssueResponse = await response.json();

    if (data.data && Array.isArray(data.data)) {
      return data;
    } else {
      throw new Error("Format data tidak valid");
    }
  } catch (err) {
    console.error("Error fetching issues");
    throw err;
  }
};

export const fetchIssueDetail = async (id: number) => {
  try {
    const response = await fetch(`/api/issue/get-byid/${id.toString()}`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data: IssueDetailResponse = await response.json();

    return data;
  } catch (err) {
    console.error("Error fetching descriptions");
    throw err;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addIssue = async (issue: any) => {
  try {
    const response = await fetch("/api/issue/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(issue),
    });

    // Kalau status bukan 2xx
    if (!response.ok) {
      let errorMessage = `Error ${response.status} ${response.statusText}`;

      const rawText = await response.text(); // ✅ baca body sekali saja
      try {
        const errorData = JSON.parse(rawText);
        if (errorData?.message) {
          errorMessage = errorData.message;
        }
      } catch {
        if (rawText) {
          errorMessage = rawText;
        }
      }

      throw new Error(errorMessage);
    }

    // kalau sukses, balikin data JSON
    return await response.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error adding issue / report:", error.message || error);
    throw error;
  }
};

export const fetchIssuesMonthly = async () => {
  try {
    const response = await fetch(`/api/summary/issue-monthly`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data: IssueMonthlyResponse = await response.json();

    if (data.data && Array.isArray(data.data)) {
      return data;
    } else {
      throw new Error("Format data tidak valid");
    }
  } catch (err) {
    console.error("Error fetching descriptions");
    throw err;
  }
};

export const exportIssues = async (startDate: string, endDate: string) => {
  try {
    const response = await fetch(
      `/api/issue/export?startDate=${encodeURIComponent(
        startDate
      )}&endDate=${encodeURIComponent(endDate)}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Gagal export data");
    }

    // ambil hasil response (Excel) sebagai blob
    const blob = await response.blob();

    // bikin link download otomatis
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `occ_issues_${startDate}_${endDate}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    return true;
  } catch (error) {
    console.error("Error exporting issues:", error);
    throw error;
  }
};

export const updateDuration = async (id: number, duration: string) => {
  try {
    const response = await fetch(`/api/issue/input-duration/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ duration }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating duration:", error);
    throw error;
  }
};

export const snapshotImage = async (idGate: number, urlServer: string) => {
  try {
    const response = await fetch(
      `${urlServer}/api/cctv/snapshot-image/${Number(idGate)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating duration:", error);
    throw error;
  }
};
