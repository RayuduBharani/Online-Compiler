import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Editor } from '@monaco-editor/react'
import { Sun, Moon, Maximize2, Minus, Plus, Play } from 'lucide-react'

interface DesktopCodeEditorProps {
    code: string;
    setCode: (code: string) => void;
    isDarkMode: boolean;
    setIsDarkMode: (value: boolean) => void;
    fontSize: number;
    setFontSize: (value: number) => void;
    handleRunCode: () => void;
    isRunning: boolean;
}

export default function DesktopCodeEditor({
    code,
    setCode,
    isDarkMode,
    setIsDarkMode,
    fontSize,
    setFontSize,
    handleRunCode,
    isRunning
}: DesktopCodeEditorProps) {
    return (
        <div className="h-full p-4">
            <Card className="h-full bg-background shadow-sm rounded-lg">
                {/* Desktop File Tab */}
                <div className="flex items-center justify-between border-b border-muted px-4 py-2 bg-background rounded-t-lg">
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-red-500 rounded-full" />
                            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                            <div className="w-3 h-3 bg-green-500 rounded-full" />
                        </div>
                        <div className="ml-4 text-sm font-medium text-muted-foreground">main.py</div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <select className="text-sm border rounded px-2 py-1 bg-background">
                            <option>Python</option>
                        </select>
                        <Button variant="ghost" size="sm" onClick={() => setIsDarkMode(!isDarkMode)}>
                            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="sm">
                            <Maximize2 className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center space-x-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setFontSize(Math.max(10, fontSize - 1))}
                            >
                                <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm px-2">{fontSize}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                            >
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>
                        <Button
                            onClick={handleRunCode}
                            disabled={isRunning}
                            size="sm"
                        >
                            <Play className="h-4 w-4 mr-2" />
                            Run
                        </Button>
                    </div>
                </div>
                {/* Code Editor Area - Desktop */}
                <CardContent className="flex-1 p-0 h-[calc(100%-60px)]">
                    <div className="h-full">
                        <Editor
                            height="100%"
                            defaultLanguage="python"
                            value={code}
                            theme={isDarkMode ? 'vs-dark' : 'vs'}
                            options={{
                                fontSize: fontSize,
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                wordWrap: 'on',
                                lineNumbers: 'on',
                                automaticLayout: true,
                                padding: { top: 16, bottom: 16 },
                                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                                renderLineHighlight: 'gutter',
                                selectionHighlight: true,
                                contextmenu: true,
                                copyWithSyntaxHighlighting: true,
                                formatOnPaste: true,
                                formatOnType: true,
                                suggest: {
                                    showKeywords: true,
                                    showSnippets: true,
                                },
                                quickSuggestions: {
                                    other: true,
                                    comments: false,
                                    strings: false,
                                },
                            }}
                            onChange={(value) => setCode(value || '')}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
