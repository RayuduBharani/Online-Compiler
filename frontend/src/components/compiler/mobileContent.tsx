import React from 'react';
import { Editor } from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X } from 'lucide-react';

interface MobileContentProps {
  activeTab: 'code' | 'console';
  code: string;
  setCode: (value: string) => void;
  isDarkMode: boolean;
  fontSize: number;
  showInputBox: boolean;
  setShowInputBox: (value: boolean) => void;
  hasInputCalls: boolean;
  inputCallsCount: number;
  getInputPrompts: string[];
  inputs: string;
  setInputs: (value: string) => void;
  isRunning: boolean;
  sendCodeAndInputs: () => void;
  validateInputs: () => boolean;
  clearOutput: () => void;
  error: string;
  output: string;
}

export default function MobileContent({
  activeTab,
  code,
  setCode,
  isDarkMode,
  fontSize,
  showInputBox,
  setShowInputBox,
  hasInputCalls,
  inputCallsCount,
  getInputPrompts,
  inputs,
  setInputs,
  isRunning,
  sendCodeAndInputs,
  validateInputs,
  clearOutput,
  error,
  output
}: MobileContentProps) {
  return (
    <div className="flex-1 relative">
          {/* Code Tab - Mobile */}
          {activeTab === 'code' && (
            <div className="absolute inset-0">
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
          )}

          {/* Console Tab - Mobile */}
          {activeTab === 'console' && (
            <div className="absolute inset-0 flex flex-col">
              <div className="flex-1 overflow-auto p-4">
                {showInputBox && hasInputCalls && (
                  <Card className="mb-4">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">
                          Program Inputs ({inputCallsCount} needed):
                        </label>
                        <Button
                          onClick={() => setShowInputBox(false)}
                          variant="ghost"
                          size="sm"
                          disabled={isRunning}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {getInputPrompts.length > 0 && (
                        <div className="bg-muted rounded-md p-3 mb-3">
                          <div className="text-xs font-medium text-muted-foreground mb-2">
                            Input prompts in order:
                          </div>
                          <ol className="text-xs text-foreground list-decimal ml-4">
                            {getInputPrompts.map((prompt, idx) => (
                              <li key={idx} className="font-mono mb-1">
                                {prompt}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      <Textarea
                        value={inputs}
                        onChange={e => setInputs(e.target.value)}
                        className="mb-3 font-mono text-sm"
                        placeholder="Enter inputs (one per line)"
                        rows={3}
                      />

                      {!validateInputs() && inputs.trim() && (
                        <Alert variant="destructive" className="mb-3">
                          <AlertDescription className="text-sm">
                            Expected {inputCallsCount} inputs, got{' '}
                            {
                              inputs
                                .trim()
                                .split('\n')
                                .filter(line => line.trim() !== '').length
                            }
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="flex gap-2">
                        <Button
                          onClick={sendCodeAndInputs}
                          disabled={isRunning || !validateInputs()}
                          size="sm"
                          className="flex-1"
                        >
                          {isRunning ? 'Running...' : 'Execute'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Output Section - Mobile */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-muted-foreground">
                      Output
                    </div>
                    <Button onClick={clearOutput} variant="outline" size="sm">
                      Clear
                    </Button>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription className="font-mono text-sm whitespace-pre-wrap">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {output && (
                    <div className="border border-muted rounded-md bg-background p-4 font-mono text-sm whitespace-pre-wrap text-foreground shadow-sm">
                      {output}
                      <p className='pt-4 text-muted-foreground text-xs'>
                        === Code Execution Successful ===
                      </p>
                    </div>
                  )}

                  {!output && !error && !isRunning && !showInputBox && (
                    <div className="text-muted-foreground text-center py-12 flex flex-col items-center">
                      <div className="text-4xl mb-4">▷</div>
                      <p className="text-sm mb-2">Click &rdquo;Run Code&rdquo; to execute</p>
                      <p className="text-xs text-muted-foreground">
                        Practice your coding skills with PrepFlow
                      </p>
                      {hasInputCalls && (
                        <p className="text-xs mt-2 text-blue-600">
                          This code requires inputs
                        </p>
                      )}
                    </div>
                  )}

                  {isRunning && (
                    <div className="text-blue-600 text-center py-12 flex flex-col items-center">
                      <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mb-4" />
                      <p className="text-sm">Executing Python code...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
  )
}
