"use client"; // Needed for Next.js App Router (if using in a Client Component)

import React, { useEffect, useState } from "react";
import FirstBlog from "@/components/FirstBlog";
import OtherBlogs from "@/components/OtherBlogs";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/blog", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await res.json();
        setBlogs(data);
        setFilteredBlogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Handle Search
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(query)
    );

    setFilteredBlogs(filtered);
  };

  if (loading) return <h3 className="text-center">Loading blogs...</h3>;
  if (error) return <h3 className="text-center text-red-500">{error}</h3>;
  if (!filteredBlogs.length) return <h3 className="text-center">No Blogs Found...</h3>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-center my-10 text-2xl font-bold">
        <span className="text-primaryColor">Trending</span> Blog
      </h2>

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryColor"
        />
      </div>

      <FirstBlog firstBlog={filteredBlogs[0]} />
      <OtherBlogs otherBlogs={filteredBlogs.slice(1)} />
    </div>
  );
};

export default Blog;
