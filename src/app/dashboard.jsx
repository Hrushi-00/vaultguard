"use client"

import { useState, useMemo } from "react"
import {
  File,
  ImageIcon,
  Search,
  Upload,
  Download,
  Share,
  User,
  MoreVertical,
  Filter,
  Grid,
  List,
  Calendar,
  FileText,
  Trash2,
  Eye,
  Star,
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"

const Dashboard = () => {
  const [files] = useState([
    {
      id: 1,
      name: "financial_report_2024.pdf",
      type: "document",
      size: "2.4 MB",
      date: "May 29, 2025",
      shared: true,
      starred: false,
    },
    {
      id: 2,
      name: "business_plan.docx",
      type: "document",
      size: "1.8 MB",
      date: "May 28, 2025",
      shared: true,
      starred: true,
    },
    {
      id: 3,
      name: "family_photo.jpg",
      type: "image",
      size: "3.2 MB",
      date: "May 27, 2025",
      shared: false,
      starred: false,
    },
    {
      id: 4,
      name: "passport_scan.jpg",
      type: "image",
      size: "1.5 MB",
      date: "May 26, 2025",
      shared: false,
      starred: true,
    },
    {
      id: 5,
      name: "tax_documents_2023.pdf",
      type: "document",
      size: "4.7 MB",
      date: "May 1, 2025",
      shared: false,
      starred: false,
    },
    {
      id: 6,
      name: "presentation.pptx",
      type: "document",
      size: "5.1 MB",
      date: "May 25, 2025",
      shared: true,
      starred: false,
    },
    {
      id: 7,
      name: "vacation_photos.zip",
      type: "archive",
      size: "12.3 MB",
      date: "May 24, 2025",
      shared: false,
      starred: false,
    },
    {
      id: 8,
      name: "contract_draft.pdf",
      type: "document",
      size: "890 KB",
      date: "May 23, 2025",
      shared: true,
      starred: true,
    },
  ])

  const [recentActivity] = useState([
    { type: "upload", user: "Chrome/macOS", time: "May 29, 2025 at 08:46 PM", file: "financial_report_2024.pdf" },
    { type: "download", user: "Chrome/macOS", time: "May 29, 2025 at 08:46 PM", file: "business_plan.docx" },
    { type: "share", user: "Chrome/macOS", time: "May 29, 2025 at 08:46 PM", file: "family_photo.jpg" },
    { type: "login", user: "Chrome/macOS", time: "May 27, 2025 at 12:30 PM", file: null },
    { type: "upload", user: "Safari/iOS", time: "May 26, 2025 at 03:15 PM", file: "passport_scan.jpg" },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  const getFileIcon = (type) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-5 w-5 text-blue-500" />
      case "archive":
        return <File className="h-5 w-5 text-purple-500" />
      default:
        return <FileText className="h-5 w-5 text-orange-500" />
    }
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case "upload":
        return <Upload className="h-4 w-4 text-green-500" />
      case "download":
        return <Download className="h-4 w-4 text-blue-500" />
      case "share":
        return <Share className="h-4 w-4 text-purple-500" />
      case "login":
        return <User className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  const filteredAndSortedFiles = useMemo(() => {
    const filtered = files.filter((file) => {
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterType === "all" || file.type === filterType
      return matchesSearch && matchesFilter
    })

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "size":
          return Number.parseFloat(a.size) - Number.parseFloat(b.size)
        case "date":
        default:
          return new Date(b.date) - new Date(a.date)
      }
    })
  }, [files, searchTerm, filterType, sortBy])

  const handleFileAction = (action, fileId) => {
    console.log(`${action} file with ID: ${fileId}`)
    // Add your file action logic here
  }

  const stats = {
    totalFiles: files.length,
    totalSize: files.reduce((acc, file) => acc + Number.parseFloat(file.size), 0).toFixed(1),
    sharedFiles: files.filter((f) => f.shared).length,
    starredFiles: files.filter((f) => f.starred).length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Files</h1>
              <p className="text-gray-600">Manage and secure your important documents</p>
            </div>
         
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Files</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalFiles}</p>
                  </div>
                  <File className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Size</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalSize} MB</p>
                  </div>
                  <FileText className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Shared</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.sharedFiles}</p>
                  </div>
                  <Share className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Starred</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.starredFiles}</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-32">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="document">Documents</SelectItem>
                      <SelectItem value="image">Images</SelectItem>
                      <SelectItem value="archive">Archives</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <Calendar className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="size">Size</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex border rounded-md">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="files" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-96">
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="files">
            {/* Files Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredAndSortedFiles.map((file) => (
                  <Card key={file.id} className="group hover:shadow-lg transition-all duration-200 hover:scale-105">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          {getFileIcon(file.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{file.size}</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleFileAction("view", file.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleFileAction("download", file.id)}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleFileAction("share", file.id)}>
                              <Share className="h-4 w-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleFileAction("delete", file.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{file.date}</span>
                        <div className="flex items-center space-x-1">
                          {file.starred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                          {file.shared && (
                            <Badge variant="secondary" className="text-xs">
                              Shared
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {filteredAndSortedFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-4 hover:bg-gray-50 group">
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          {getFileIcon(file.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {file.size} â€¢ {file.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {file.starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                          {file.shared && <Badge variant="secondary">Shared</Badge>}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleFileAction("view", file.id)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleFileAction("download", file.id)}>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleFileAction("share", file.id)}>
                                <Share className="h-4 w-4 mr-2" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleFileAction("delete", file.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.type === "login"
                              ? "Logged in"
                              : `${activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}ed`}
                            {activity.file && <span className="font-normal text-gray-600"> {activity.file}</span>}
                          </p>
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">IP: TID_88511 â€¢ {activity.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Dashboard