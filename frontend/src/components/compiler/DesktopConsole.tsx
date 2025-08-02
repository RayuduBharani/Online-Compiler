import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import DesktopOutput from './DesktopOutput'

interface DesktopConsoleProps {
  showInputBox: boolean;
  hasInputCalls: boolean;
  inputCallsCount: number;
  getInputPrompts: string[];
  inputs: string;
  setInputs: (value: string) => void;
  isRunning: boolean;
  sendCodeAndInputs: () => void;
  validateInputs: () => boolean;
  setShowInputBox: (value: boolean) => void;
  clearOutput: () => void;
  error: string;
  output: string;
}

export default function DesktopConsole({
  showInputBox,
  hasInputCalls,
  inputCallsCount,
  getInputPrompts,
  inputs,
  setInputs,
  isRunning,
  sendCodeAndInputs,
  validateInputs,
  setShowInputBox,
  clearOutput,
  error,
  output
}: DesktopConsoleProps) {
  return (
    <div className="h-full p-4 pl-0">
              <Card className="h-full bg-background shadow-sm rounded-lg">
                <div className="border-b border-muted px-4 py-3 bg-background rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-medium text-foreground">Console</div>
                    </div>
                    <Button onClick={clearOutput} variant="secondary" size="sm">
                      Clear
                    </Button>
                  </div>
                </div>

                {/* Console Output Panel - Desktop */}
                <CardContent className="flex-1 flex flex-col h-[calc(100%-60px)] p-0">
                  {showInputBox && hasInputCalls && (
                    <div className="p-4 border-b bg-background">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-foreground">
                          Program Inputs ({inputCallsCount} needed):
                        </label>
                      </div>
                      {getInputPrompts.length > 0 && (
                        <div className="bg-muted border border-muted rounded-md p-3 mb-3">
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
                        >
                          {isRunning ? 'Running...' : 'Execute'}
                        </Button>
                        <Button
                          onClick={() => setShowInputBox(false)}
                          variant="outline"
                          size="sm"
                          disabled={isRunning}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Output/Status/Error Panel - Desktop */}
                  <DesktopOutput
                    error={error}
                    output={output}
                    isRunning={isRunning}
                    showInputBox={showInputBox}
                    hasInputCalls={hasInputCalls}
                  />

                </CardContent>
              </Card>
            </div>
  )
}
