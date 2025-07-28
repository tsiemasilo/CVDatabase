import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const token = localStorage.getItem('authToken');
  const headers: Record<string, string> = {};
  
  if (data) {
    headers["Content-Type"] = "application/json";
  }
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Handle different environments
  const isProduction = window.location.hostname.includes('netlify.app');
  let fetchUrl: string;
  
  if (isProduction) {
    // Map API routes to individual Netlify functions
    if (url === '/api/auth/login') {
      fetchUrl = 'https://cvdatabase.netlify.app/.netlify/functions/login';
    } else if (url === '/api/cv-records') {
      fetchUrl = 'https://cvdatabase.netlify.app/.netlify/functions/cv-records';
    } else if (url === '/api/health') {
      fetchUrl = 'https://cvdatabase.netlify.app/.netlify/functions/health';
    } else {
      fetchUrl = `https://cvdatabase.netlify.app/.netlify/functions/api${url.replace('/api', '')}`;
    }
  } else {
    fetchUrl = url;
  }

  const res = await fetch(fetchUrl, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const token = localStorage.getItem('authToken');
    const headers: Record<string, string> = {};
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Handle different environments
    const isProduction = window.location.hostname.includes('netlify.app');
    let fetchUrl: string;
    
    if (isProduction) {
      const apiPath = queryKey[0] as string;
      // Since API.js serverless function doesn't work with path routing, 
      // use individual Netlify functions for each endpoint
      if (apiPath === '/api/auth/user') {
        // Create custom user function that calls API.js auth/user endpoint
        fetchUrl = 'https://cvdatabase.netlify.app/.netlify/functions/user';
      } else if (apiPath === '/api/cv-records') {
        fetchUrl = 'https://cvdatabase.netlify.app/.netlify/functions/cv-records';
      } else if (apiPath === '/api/health') {
        fetchUrl = 'https://cvdatabase.netlify.app/.netlify/functions/health';
      } else {
        // Fallback to direct individual functions
        fetchUrl = `https://cvdatabase.netlify.app/.netlify/functions${apiPath.replace('/api', '')}`;
      }
    } else {
      fetchUrl = queryKey[0] as string;
    }

    const res = await fetch(fetchUrl, {
      headers,
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
