import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  Grid,
  IconButton,
  Input,
  Textarea,
  Flex,
  Box,
  Button,
  Tag,
  TagLabel,
  TagCloseButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { FiPlus, FiSmile } from 'react-icons/fi';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import NoteCard from './NoteCard';

function Notes(searchTerm) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTags, setSelectedTags] = useState([])
  const { googleId} = useParams()

  useEffect(() => {
    fetchNotes(searchTerm.searchTerm);
  }, [googleId, searchTerm.searchTerm]);

  const fetchNotes = async (searchTerm) => {
    try {
      const response = await axios.get(`https://protected-peak-20722-b8ffb97d9c03.herokuapp.com/notes/${googleId}`, {
        params: {
          search: searchTerm,
        },
      });
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const addNote = async () => {
    try {
      const newNote = {
        title: title,
        content: content,
        tags: tags,
      };

      
      await axios.post(`https://protected-peak-20722-b8ffb97d9c03.herokuapp.com/notes/${googleId}`, newNote);

      
      fetchNotes();

      onClose();
      setTitle('');
      setContent('');
      setTags([]);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleToggleEmojiPicker = () => {
    setEmojiPickerOpen((prev) => !prev);
  };

  const handleEmojiSelect = (emojiObject) => {
    const emoji = emojiObject.emoji;
    setContent((prevContent) => prevContent + emoji);
    setEmojiPickerOpen(false);
  };

  const handleTagInputChange = (event) => {
    setTagInput(event.target.value);
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== '') {
      setTags((prevTags) => [...prevTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (index) => {
    setTags((prevTags) => prevTags.filter((_, i) => i !== index));
  };

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags((prevTags) => prevTags.filter((t) => t !== tag));
    } else {
      setSelectedTags((prevTags) => [...prevTags, tag]);
    }
  };

  const filteredNotes = selectedTags.length
    ? notes.filter((note) => note.tags.some((tag) => selectedTags.includes(tag)))
    : notes;

  return (
    <div>
      <Button
        position="fixed"
        bottom="2rem"
        right="2rem"
        colorScheme="teal"
        size="lg"
        width="3rem"
        height="3rem"
        borderRadius="md"
        onClick={onOpen}
      >
        <Flex align="center" justify="center" height="100%">
          <Box as={FiPlus} />
        </Flex>
      </Button>

      <Flex ml={'4rem'} mb={4} wrap="wrap">
        {Array.from(new Set(notes.flatMap((note) => note.tags))).map((tag, index) => (
          <Button
            key={index}
            colorScheme={selectedTags.includes(tag) ? 'teal' : 'gray'}
            variant="outline"
            mr={2}
            mb={2}
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </Button>
        ))}
      </Flex>

      <Grid
        templateColumns={{base: "1fr", md: 'repeat(auto-fill, minmax(10rem, 1fr))'}}
        gap={{base:"1rem", md:"5rem"}}
        padding={{base:"0.5rem", md:"3rem"}}
        marginTop="-1.5rem"
      >
        {filteredNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            googleId={googleId}
            onTagClick={handleTagClick}
          />
        ))}
      </Grid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a New Note</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Title"
              value={title}
              onChange={handleTitleChange}
              mb={2}
            />
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={handleContentChange}
              mb={2}
            />
            <Flex justify="flex-start" align="center" mb={2}>
              <Box ml={-4}>
                <IconButton
                  icon={<FiSmile size={20} />}
                  variant="ghost"
                  colorScheme="blue"
                  _hover={{ color: 'blue.600' }}
                  onClick={handleToggleEmojiPicker}
                />
              </Box>
            </Flex>
            <Flex mb={2}>
              <Input
                placeholder="Add tags"
                value={tagInput}
                onChange={handleTagInputChange}
              />
              <Button ml={2} onClick={handleAddTag}>
                Add Tag
              </Button>
            </Flex>
            {tags.map((tag, index) => (
              <Tag key={index} mb={1} mr={1}>
                <TagLabel>{tag}</TagLabel>
                <TagCloseButton onClick={() => handleRemoveTag(index)} />
              </Tag>
            ))}
            {isEmojiPickerOpen && (
              <EmojiPicker
                onEmojiClick={handleEmojiSelect}
                theme={Theme.DARK}
                pickerStyle={{
                  position: 'absolute',
                  bottom: '70px',
                  background: '#1A202C',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  zIndex: 1,
                }}
              />
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" onClick={addNote}>
              Save Note
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Notes;
